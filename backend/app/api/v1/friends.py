from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.friend import Friend
from app.schemas.friend import FriendCreate, FriendResponse, FriendRequestResponse, FriendAccept, FriendReject
import uuid

router = APIRouter()


@router.post("", response_model=FriendResponse, status_code=status.HTTP_201_CREATED)
async def send_friend_request(
    friend_data: FriendCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """친구 요청 보내기"""
    # 자기 자신에게 친구 요청 보낼 수 없음
    if current_user.id == friend_data.friend_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="자기 자신에게 친구 요청을 보낼 수 없습니다."
        )

    # 친구 요청을 받을 사용자가 존재하는지 확인
    friend_user = db.query(User).filter(User.id == friend_data.friend_id).first()
    if not friend_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )

    # 이미 친구 요청이 있는지 확인 (양방향)
    existing_request = db.query(Friend).filter(
        or_(
            and_(Friend.user_id == current_user.id, Friend.friend_id == friend_data.friend_id),
            and_(Friend.user_id == friend_data.friend_id, Friend.friend_id == current_user.id)
        )
    ).first()

    if existing_request:
        if existing_request.status == "accepted":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 친구입니다."
            )
        elif existing_request.status == "pending":
            if existing_request.user_id == current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="이미 친구 요청을 보냈습니다."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="이미 친구 요청을 받았습니다. 요청을 수락해주세요."
                )
        elif existing_request.status == "blocked":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="친구 요청을 보낼 수 없습니다."
            )

    # 친구 요청 생성
    new_friend_request = Friend(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        friend_id=friend_data.friend_id,
        status="pending"
    )

    db.add(new_friend_request)
    db.commit()
    db.refresh(new_friend_request)

    return new_friend_request


@router.get("/requests", response_model=List[FriendRequestResponse])
async def get_friend_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """받은 친구 요청 목록 조회"""
    requests = db.query(Friend, User).join(
        User, Friend.user_id == User.id
    ).filter(
        Friend.friend_id == current_user.id,
        Friend.status == "pending"
    ).all()

    result = []
    for friend_request, user in requests:
        result.append({
            "id": friend_request.id,
            "user_id": friend_request.user_id,
            "friend_id": friend_request.friend_id,
            "username": user.username,
            "email": user.email,
            "status": friend_request.status,
            "created_at": friend_request.created_at
        })

    return result


@router.get("", response_model=List[FriendRequestResponse])
async def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """친구 목록 조회"""
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
        result.append({
            "id": friend_request.id,
            "user_id": friend_request.user_id,
            "friend_id": friend_request.friend_id,
            "username": user.username,
            "email": user.email,
            "status": friend_request.status,
            "created_at": friend_request.created_at
        })

    # 받은 요청의 친구들
    for friend_request, user in received_requests:
        result.append({
            "id": friend_request.id,
            "user_id": friend_request.user_id,
            "friend_id": friend_request.friend_id,
            "username": user.username,
            "email": user.email,
            "status": friend_request.status,
            "created_at": friend_request.created_at
        })

    return result


@router.post("/accept", response_model=FriendResponse)
async def accept_friend_request(
    request_data: FriendAccept,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """친구 요청 수락"""
    friend_request = db.query(Friend).filter(
        Friend.id == request_data.friend_request_id,
        Friend.friend_id == current_user.id,
        Friend.status == "pending"
    ).first()

    if not friend_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="친구 요청을 찾을 수 없습니다."
        )

    # 친구 요청 상태를 accepted로 변경
    friend_request.status = "accepted"
    db.commit()
    db.refresh(friend_request)

    return friend_request


@router.post("/reject", status_code=status.HTTP_204_NO_CONTENT)
async def reject_friend_request(
    request_data: FriendReject,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """친구 요청 거절"""
    friend_request = db.query(Friend).filter(
        Friend.id == request_data.friend_request_id,
        Friend.friend_id == current_user.id,
        Friend.status == "pending"
    ).first()

    if not friend_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="친구 요청을 찾을 수 없습니다."
        )

    # 친구 요청 삭제
    db.delete(friend_request)
    db.commit()

    return None


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_friend(
    friend_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """친구 삭제"""
    # 양방향 친구 관계 찾기
    friend_relationship = db.query(Friend).filter(
        or_(
            and_(Friend.user_id == current_user.id, Friend.friend_id == friend_id),
            and_(Friend.user_id == friend_id, Friend.friend_id == current_user.id)
        ),
        Friend.status == "accepted"
    ).first()

    if not friend_relationship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="친구 관계를 찾을 수 없습니다."
        )

    # 친구 관계 삭제
    db.delete(friend_relationship)
    db.commit()

    return None


@router.get("/search", response_model=List[dict])
async def search_users(
    username: str = Query(..., description="검색할 사용자명"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자 검색 (친구 추가용)"""
    users = db.query(User).filter(
        User.username.ilike(f"%{username}%"),
        User.id != current_user.id
    ).limit(10).all()

    # 친구 관계 확인
    friend_ids = set()
    friend_relations = db.query(Friend).filter(
        or_(
            Friend.user_id == current_user.id,
            Friend.friend_id == current_user.id
        )
    ).all()

    for relation in friend_relations:
        if relation.user_id == current_user.id:
            friend_ids.add(relation.friend_id)
        else:
            friend_ids.add(relation.user_id)

    result = []
    for user in users:
        is_friend = user.id in friend_ids
        # 친구 요청 상태 확인
        friend_request = db.query(Friend).filter(
            or_(
                and_(Friend.user_id == current_user.id, Friend.friend_id == user.id),
                and_(Friend.user_id == user.id, Friend.friend_id == current_user.id)
            )
        ).first()

        status = None
        if friend_request:
            status = friend_request.status

        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_friend": is_friend,
            "friend_status": status
        })

    return result

