from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.spiritling import Spiritling
from app.models.friend import Friend
from app.schemas.user import UserResponse
from app.schemas.spiritling import SpiritlingResponse

router = APIRouter()


@router.get("/user/{user_id}", response_model=UserResponse)
async def get_user_profile(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자 프로필 조회 (친구인 경우)"""
    # 자기 자신의 프로필은 항상 볼 수 있음
    if user_id == current_user.id:
        return current_user
    
    # 친구인지 확인
    friend_relationship = db.query(Friend).filter(
        or_(
            and_(Friend.user_id == current_user.id, Friend.friend_id == user_id),
            and_(Friend.user_id == user_id, Friend.friend_id == current_user.id)
        ),
        Friend.status == "accepted"
    ).first()
    
    if not friend_relationship:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="친구만 프로필을 볼 수 있습니다."
        )
    
    # 사용자 정보 조회
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )
    
    return user


@router.get("/user/{user_id}/spiritlings", response_model=List[SpiritlingResponse])
async def get_user_spiritlings(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자의 마정령 목록 조회 (친구인 경우)"""
    # 자기 자신의 마정령은 항상 볼 수 있음
    if user_id == current_user.id:
        spiritlings = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).all()
        return spiritlings
    
    # 친구인지 확인
    friend_relationship = db.query(Friend).filter(
        or_(
            and_(Friend.user_id == current_user.id, Friend.friend_id == user_id),
            and_(Friend.user_id == user_id, Friend.friend_id == current_user.id)
        ),
        Friend.status == "accepted"
    ).first()
    
    if not friend_relationship:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="친구만 마정령을 볼 수 있습니다."
        )
    
    # 마정령 목록 조회
    spiritlings = db.query(Spiritling).filter(Spiritling.user_id == user_id).all()
    return spiritlings


@router.get("/friends", response_model=List[dict])
async def get_friends_for_village(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마을 방문용 친구 목록 조회"""
    # 현재 사용자가 보낸 친구 요청 중 accepted인 것들
    sent_requests = db.query(Friend, User).join(
        User, Friend.friend_id == User.id
    ).filter(
        Friend.user_id == current_user.id,
        Friend.status == "accepted"
    ).all()
    
    # 현재 사용자가 받은 친구 요청 중 accepted인 것들
    received_requests = db.query(Friend, User).join(
        User, Friend.user_id == User.id
    ).filter(
        Friend.friend_id == current_user.id,
        Friend.status == "accepted"
    ).all()
    
    result = []
    # 보낸 요청의 친구들
    for friend_request, user in sent_requests:
        spiritling_count = db.query(Spiritling).filter(Spiritling.user_id == user.id).count()
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "spiritling_count": spiritling_count,
            "created_at": user.created_at.isoformat() if user.created_at else None
        })
    
    # 받은 요청의 친구들
    for friend_request, user in received_requests:
        # 중복 제거
        if not any(r["id"] == user.id for r in result):
            spiritling_count = db.query(Spiritling).filter(Spiritling.user_id == user.id).count()
            result.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "spiritling_count": spiritling_count,
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
    
    return result

