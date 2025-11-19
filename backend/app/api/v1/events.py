from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.event import Event, EventParticipation
from app.schemas.event import EventCreate, EventResponse, EventParticipationResponse
import uuid

router = APIRouter()


@router.get("", response_model=List[EventResponse])
async def get_events(
    status_filter: str = Query(None, description="upcoming, active, ended"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """이벤트 목록 조회"""
    query = db.query(Event)
    
    if status_filter:
        query = query.filter(Event.status == status_filter)
    
    # 날짜 기준으로 상태 업데이트
    now = datetime.now()
    events = query.all()
    for event in events:
        if event.start_time > now:
            event.status = "upcoming"
        elif event.end_time < now:
            event.status = "ended"
        else:
            event.status = "active"
    db.commit()
    
    return events


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, db: Session = Depends(get_db)):
    """특정 이벤트 상세 조회"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이벤트를 찾을 수 없습니다.")
    return event


@router.post("/{event_id}/participate", response_model=EventParticipationResponse, status_code=status.HTTP_201_CREATED)
async def participate_in_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """이벤트 참가"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이벤트를 찾을 수 없습니다.")
    
    if event.status != "active":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="현재 참가할 수 없는 이벤트입니다.")

    existing_participation = db.query(EventParticipation).filter(
        EventParticipation.user_id == current_user.id,
        EventParticipation.event_id == event_id
    ).first()

    if existing_participation:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 참가한 이벤트입니다.")

    new_participation = EventParticipation(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        event_id=event_id,
        participated_at=datetime.now(),
        score={}, # 초기 점수 또는 진행 상황
        reward_claimed="false"
    )
    db.add(new_participation)
    db.commit()
    db.refresh(new_participation)
    return new_participation


@router.get("/user/me", response_model=List[EventParticipationResponse])
async def get_my_events(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """내 이벤트 참가 목록 조회"""
    participations = db.query(EventParticipation).filter(
        EventParticipation.user_id == current_user.id
    ).all()
    
    return participations


@router.post("/{event_id}/claim-reward", status_code=status.HTTP_200_OK)
async def claim_event_reward(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """이벤트 보상 수령"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이벤트를 찾을 수 없습니다.")
    
    if event.status != "ended":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="종료된 이벤트만 보상을 수령할 수 있습니다.")

    participation = db.query(EventParticipation).filter(
        EventParticipation.user_id == current_user.id,
        EventParticipation.event_id == event_id
    ).first()

    if not participation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이벤트에 참가하지 않았습니다.")
    
    if participation.reward_claimed == "true":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 보상을 수령했습니다.")
    
    # TODO: 실제 보상 지급 로직 구현 (코인, 아이템 등)
    # 예시: 코인 지급
    reward = event.reward or {}
    if reward.get("coins", 0) > 0:
        current_user.coins += reward["coins"]
    
    participation.reward_claimed = "true"
    db.commit()
    db.refresh(current_user)
    db.refresh(participation)

    return {"message": f"{event.name} 이벤트 보상을 수령했습니다!"}

