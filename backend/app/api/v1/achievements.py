from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.achievement import Achievement, UserAchievement
from app.models.spiritling import Spiritling
from app.schemas.achievement import AchievementResponse, UserAchievementResponse
import uuid

router = APIRouter()


@router.get("", response_model=List[AchievementResponse])
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """업적 목록 조회"""
    achievements = db.query(Achievement).all()
    return achievements


@router.get("/user/me", response_model=List[UserAchievementResponse])
async def get_my_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """내 업적 조회"""
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    return user_achievements


@router.post("/{achievement_id}/claim", response_model=UserAchievementResponse)
async def claim_achievement(
    achievement_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """업적 보상 받기"""
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Achievement not found")
    
    # 사용자 업적 확인
    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement_id
    ).first()
    
    if not user_achievement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User achievement not found")
    
    if user_achievement.completed != "true":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Achievement not completed")
    
    # 보상 지급
    reward = achievement.reward or {}
    if reward.get("coins", 0) > 0:
        current_user.coins += reward["coins"]
        db.commit()
    
    # TODO: 아이템 보상 지급 (reward.items가 있는 경우)
    
    return user_achievement


def check_achievements(user_id: str, db: Session):
    """
    사용자의 현재 상태를 기반으로 업적 달성 여부를 확인하고 업데이트하는 내부 함수
    """
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return

        spiritlings = db.query(Spiritling).filter(Spiritling.user_id == user_id).all()
        all_achievements = db.query(Achievement).all()
    except Exception as e:
        print(f"Error in check_achievements (query): {e}")
        return
    
    for achievement in all_achievements:
        user_achievement = db.query(UserAchievement).filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement.id
        ).first()
        
        if not user_achievement:
            user_achievement = UserAchievement(
                id=str(uuid.uuid4()),
                user_id=user_id,
                achievement_id=achievement.id,
                progress={},
                completed="false",
            )
            db.add(user_achievement)
            db.commit()
            db.refresh(user_achievement)
        
        if user_achievement.completed == "true":
            continue
        
        # 업적 조건 확인
        requirement = achievement.requirement
        completed = False
        
        if achievement.category == "level":
            max_level = max([s.level for s in spiritlings], default=0)
            target_level = requirement.get("level", 0)
            if max_level >= target_level:
                completed = True
                user_achievement.progress = {"level": max_level}
        elif achievement.category == "collection":
            count = len(spiritlings)
            target_count = requirement.get("count", 0)
            if count >= target_count:
                completed = True
                user_achievement.progress = {"count": count}
        elif achievement.category == "stat":
            stat_name = requirement.get("stat")
            target_value = requirement.get("value", 0)
            max_stat = 0
            # 스탯 이름을 모델 속성 이름으로 매핑
            stat_mapping = {
                "health": "health_stat",
                "agility": "agility_stat",
                "intelligence": "intelligence_stat",
                "friendliness": "friendliness_stat",
                "resilience": "resilience_stat",
                "luck": "luck_stat",
            }
            stat_attr = stat_mapping.get(stat_name)
            if stat_attr:
                for spiritling in spiritlings:
                    stat_value = getattr(spiritling, stat_attr, 0) or 0
                    max_stat = max(max_stat, stat_value)
            if max_stat >= target_value:
                completed = True
                user_achievement.progress = {stat_name: max_stat}
        elif achievement.category == "coins":
            target_coins = requirement.get("coins", 0)
            if user.coins >= target_coins:
                completed = True
                user_achievement.progress = {"coins": user.coins}
        
        if completed:
            user_achievement.completed = "true"
            user_achievement.completed_at = datetime.now()
            db.commit()

