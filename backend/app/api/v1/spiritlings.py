from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.spiritling import Spiritling
from app.schemas.spiritling import SpiritlingCreate, SpiritlingUpdate, SpiritlingResponse
from app.utils.spiritling_utils import check_level_up
from app.utils.action_log_utils import create_action_log

router = APIRouter()


@router.post("", response_model=SpiritlingResponse, status_code=status.HTTP_201_CREATED)
async def create_spiritling(
    spiritling_data: SpiritlingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 생성"""
    import uuid
    import random
    
    # 랜덤 성장 단계와 초기 스탯
    new_spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name=spiritling_data.name,
        element=spiritling_data.element,
        personality=spiritling_data.personality,
        growth_stage="egg",
        level=1,
        experience=0,
        health_stat=10,
        agility_stat=10,
        intelligence_stat=10,
        friendliness_stat=10,
        resilience_stat=10,
        luck_stat=10,
        hunger=100,
        happiness=100,
        energy=100,
        health_status=100,
        cleanliness=100,
        current_action="idle",
        action_data={},
        user_id=current_user.id
    )
    
    db.add(new_spiritling)
    db.commit()
    db.refresh(new_spiritling)
    
    # 생성 로그
    create_action_log(db, new_spiritling.id, "create", f"{new_spiritling.name}이(가) 태어났습니다! 🎉")
    db.commit()
    
    return new_spiritling


@router.get("", response_model=List[SpiritlingResponse])
async def get_spiritlings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 목록 조회"""
    spiritlings = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).all()
    return spiritlings


@router.get("/{spiritling_id}", response_model=SpiritlingResponse)
async def get_spiritling(
    spiritling_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 상세 조회"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    return spiritling


@router.patch("/{spiritling_id}", response_model=SpiritlingResponse)
async def update_spiritling(
    spiritling_id: str,
    spiritling_data: SpiritlingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 정보 업데이트"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    update_data = spiritling_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(spiritling, key, value)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling


@router.post("/{spiritling_id}/feed", response_model=SpiritlingResponse)
async def feed_spiritling(
    spiritling_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령에게 먹이 주기"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 배고픔 증가 (최대 100)
    spiritling.hunger = min(100, spiritling.hunger + 20)
    spiritling.happiness = min(100, spiritling.happiness + 5)
    spiritling.experience += 2
    
    # 레벨 업 체크 및 성장 단계 업데이트
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    message = f"{spiritling.name}에게 먹이를 주었습니다. 배고픔 +20, 행복도 +5"
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling_id, "feed", message)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling


@router.post("/{spiritling_id}/play", response_model=SpiritlingResponse)
async def play_with_spiritling(
    spiritling_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령과 놀기"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 행복도와 친근함 증가
    spiritling.happiness = min(100, spiritling.happiness + 15)
    spiritling.friendliness_stat = min(100, spiritling.friendliness_stat + 1)
    spiritling.energy = max(0, spiritling.energy - 10)
    spiritling.experience += 3
    
    # 레벨 업 체크 및 성장 단계 업데이트
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    message = f"{spiritling.name}와 놀았습니다. 행복도 +15, 친근함 +1, 에너지 -10"
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling_id, "play", message)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling


@router.post("/{spiritling_id}/heal", response_model=SpiritlingResponse)
async def heal_spiritling(
    spiritling_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 치료하기"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 건강과 체력 증가
    spiritling.health_status = min(100, spiritling.health_status + 25)
    spiritling.health_stat = min(100, spiritling.health_stat + 2)
    spiritling.happiness = min(100, spiritling.happiness + 5)
    spiritling.experience += 2
    
    # 레벨 업 체크 및 성장 단계 업데이트
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    message = f"{spiritling.name}를 치료했습니다. 건강 +25, 체력 +2, 행복도 +5"
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling_id, "heal", message)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling


@router.post("/{spiritling_id}/clean", response_model=SpiritlingResponse)
async def clean_spiritling(
    spiritling_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 씻기기"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 청결도와 행복도 증가
    spiritling.cleanliness = min(100, spiritling.cleanliness + 30)
    spiritling.happiness = min(100, spiritling.happiness + 10)
    spiritling.health_status = min(100, spiritling.health_status + 5)
    spiritling.experience += 2
    
    # 레벨 업 체크 및 성장 단계 업데이트
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    message = f"{spiritling.name}를 씻겼습니다. 청결도 +30, 행복도 +10, 건강 +5"
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling_id, "clean", message)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling


@router.post("/{spiritling_id}/train", response_model=SpiritlingResponse)
async def train_spiritling(
    spiritling_id: str,
    stat_type: str = Query(..., description="훈련할 스탯 (health, agility, intelligence, friendliness, resilience, luck)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 훈련하기"""
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 에너지 소모
    if spiritling.energy < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="에너지가 부족합니다. (최소 20 필요)"
        )
    
    spiritling.energy = max(0, spiritling.energy - 20)
    
    # 스탯 증가
    stat_mapping = {
        "health": "health_stat",
        "agility": "agility_stat",
        "intelligence": "intelligence_stat",
        "friendliness": "friendliness_stat",
        "resilience": "resilience_stat",
        "luck": "luck_stat",
    }
    
    if stat_type not in stat_mapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"유효하지 않은 스탯 타입입니다. 가능한 값: {list(stat_mapping.keys())}"
        )
    
    stat_attr = stat_mapping[stat_type]
    current_stat = getattr(spiritling, stat_attr)
    setattr(spiritling, stat_attr, min(100, current_stat + 3))
    
    # 경험치 증가
    spiritling.experience += 10
    
    # 레벨 업 체크 및 성장 단계 업데이트
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    stat_names = {
        "health": "체력",
        "agility": "민첩",
        "intelligence": "지능",
        "friendliness": "친근함",
        "resilience": "근성",
        "luck": "운"
    }
    stat_name = stat_names.get(stat_type, stat_type)
    message = f"{spiritling.name}의 {stat_name}을(를) 훈련했습니다. {stat_name} +3, 에너지 -20"
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling_id, "train", message)
    
    db.commit()
    db.refresh(spiritling)
    
    # 업적 체크 (비동기로 실행하여 응답 지연 방지)
    try:
        from app.api.v1.achievements import check_achievements
        check_achievements(current_user.id, db)
    except Exception as e:
        print(f"Error checking achievements: {e}")
    
    return spiritling

