from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.competition import Competition
from app.models.competition_entry import CompetitionEntry
from app.models.user_item import UserItem
from app.models.item import Item
from app.models.spiritling import Spiritling
from app.schemas.competition import CompetitionResponse

router = APIRouter()


@router.post("/{competition_id}/distribute-rewards")
async def distribute_rewards(
    competition_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """대회 보상 지급 (관리자만 가능)"""
    # TODO: 관리자 권한 확인 추가
    # if not current_user.is_admin:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="관리자만 접근할 수 있습니다."
    #     )
    
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대회를 찾을 수 없습니다."
        )
    
    if competition.status != "ended":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="대회가 종료되지 않았습니다."
        )
    
    # 상위 3명 조회
    top_entries = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id
    ).order_by(desc(CompetitionEntry.score)).limit(3).all()
    
    if len(top_entries) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="참가자가 없습니다."
        )
    
    rewards_distributed = []
    rewards = competition.rewards
    
    # 1등 보상 지급
    if len(top_entries) >= 1 and "first" in rewards:
        first_entry = top_entries[0]
        # 마정령을 통해 사용자 찾기
        spiritling = db.query(Spiritling).filter(Spiritling.id == first_entry.spiritling_id).first()
        if spiritling:
            user = db.query(User).filter(User.id == spiritling.user_id).first()
        else:
            user = None
        if user:
            for reward_item in rewards["first"]:
                item = db.query(Item).filter(Item.id == reward_item["id"]).first()
                if item:
                    user_item = db.query(UserItem).filter(
                        UserItem.user_id == user.id,
                        UserItem.item_id == item.id
                    ).first()
                    
                    quantity = reward_item.get("quantity", 1)
                    
                    if user_item:
                        user_item.quantity += quantity
                    else:
                        import uuid
                        user_item = UserItem(
                            id=str(uuid.uuid4()),
                            user_id=user.id,
                            item_id=item.id,
                            quantity=quantity
                        )
                        db.add(user_item)
                    
                    rewards_distributed.append({
                        "rank": 1,
                        "user": user.username,
                        "item": item.name,
                        "quantity": quantity
                    })
    
    # 2등 보상 지급
    if len(top_entries) >= 2 and "second" in rewards:
        second_entry = top_entries[1]
        # 마정령을 통해 사용자 찾기
        spiritling = db.query(Spiritling).filter(Spiritling.id == second_entry.spiritling_id).first()
        if spiritling:
            user = db.query(User).filter(User.id == spiritling.user_id).first()
        else:
            user = None
        if user:
            for reward_item in rewards["second"]:
                item = db.query(Item).filter(Item.id == reward_item["id"]).first()
                if item:
                    user_item = db.query(UserItem).filter(
                        UserItem.user_id == user.id,
                        UserItem.item_id == item.id
                    ).first()
                    
                    quantity = reward_item.get("quantity", 1)
                    
                    if user_item:
                        user_item.quantity += quantity
                    else:
                        import uuid
                        user_item = UserItem(
                            id=str(uuid.uuid4()),
                            user_id=user.id,
                            item_id=item.id,
                            quantity=quantity
                        )
                        db.add(user_item)
                    
                    rewards_distributed.append({
                        "rank": 2,
                        "user": user.username,
                        "item": item.name,
                        "quantity": quantity
                    })
    
    # 3등 보상 지급
    if len(top_entries) >= 3 and "third" in rewards:
        third_entry = top_entries[2]
        # 마정령을 통해 사용자 찾기
        spiritling = db.query(Spiritling).filter(Spiritling.id == third_entry.spiritling_id).first()
        if spiritling:
            user = db.query(User).filter(User.id == spiritling.user_id).first()
        else:
            user = None
        if user:
            for reward_item in rewards["third"]:
                item = db.query(Item).filter(Item.id == reward_item["id"]).first()
                if item:
                    user_item = db.query(UserItem).filter(
                        UserItem.user_id == user.id,
                        UserItem.item_id == item.id
                    ).first()
                    
                    quantity = reward_item.get("quantity", 1)
                    
                    if user_item:
                        user_item.quantity += quantity
                    else:
                        import uuid
                        user_item = UserItem(
                            id=str(uuid.uuid4()),
                            user_id=user.id,
                            item_id=item.id,
                            quantity=quantity
                        )
                        db.add(user_item)
                    
                    rewards_distributed.append({
                        "rank": 3,
                        "user": user.username,
                        "item": item.name,
                        "quantity": quantity
                    })
    
    db.commit()
    
    return {
        "message": "보상이 지급되었습니다.",
        "rewards_distributed": rewards_distributed
    }


@router.get("/{competition_id}/my-rewards")
async def get_my_rewards(
    competition_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """내 대회 보상 조회"""
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대회를 찾을 수 없습니다."
        )
    
    # 내 참가 기록 조회
    # 먼저 내 마정령 ID 목록 가져오기
    my_spiritlings = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).all()
    my_spiritling_ids = [s.id for s in my_spiritlings]
    
    my_entry = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id,
        CompetitionEntry.spiritling_id.in_(my_spiritling_ids)
    ).order_by(desc(CompetitionEntry.score)).first()
    
    if not my_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="참가 기록이 없습니다."
        )
    
    # 전체 순위 조회
    all_entries = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id
    ).order_by(desc(CompetitionEntry.score)).all()
    
    my_rank = None
    for idx, entry in enumerate(all_entries, 1):
        if entry.id == my_entry.id:
            my_rank = idx
            break
    
    # 보상 정보
    rewards = competition.rewards
    my_rewards = []
    
    if my_rank == 1 and "first" in rewards:
        my_rewards = rewards["first"]
    elif my_rank == 2 and "second" in rewards:
        my_rewards = rewards["second"]
    elif my_rank == 3 and "third" in rewards:
        my_rewards = rewards["third"]
    
    return {
        "rank": my_rank,
        "score": my_entry.score,
        "rewards": my_rewards,
        "competition_name": competition.name,
        "competition_status": competition.status
    }

