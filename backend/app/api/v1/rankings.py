from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.spiritling import Spiritling
from app.models.ranking import Ranking
from app.schemas.ranking import RankingResponse, RankingListResponse
import uuid

router = APIRouter()


def calculate_rankings(category: str, db: Session):
    """랭킹 점수 계산 (공통 함수)"""
    rankings = []
    users = db.query(User).all()
    
    for user in users:
        if category == "overall":
            # 전체 랭킹: 레벨, 코인, 마정령 수 등을 종합
            spiritlings = db.query(Spiritling).filter(Spiritling.user_id == user.id).all()
            total_level = sum(s.level for s in spiritlings)
            total_stats = sum(
                (s.health_stat or 0) + 
                (s.agility_stat or 0) + 
                (s.intelligence_stat or 0) + 
                (s.friendliness_stat or 0) + 
                (s.resilience_stat or 0) + 
                (s.luck_stat or 0) 
                for s in spiritlings
            )
            score = total_level * 10 + total_stats + user.coins
        elif category == "level":
            # 레벨 랭킹
            spiritlings = db.query(Spiritling).filter(Spiritling.user_id == user.id).all()
            score = max([s.level for s in spiritlings], default=0)
        elif category == "coins":
            # 코인 랭킹
            score = user.coins
        elif category == "spiritlings":
            # 마정령 수 랭킹
            score = db.query(Spiritling).filter(Spiritling.user_id == user.id).count()
        else:
            continue
        
        rankings.append({
            "user_id": user.id,
            "username": user.username,
            "score": score,
        })
    
    # 점수 기준 정렬
    rankings.sort(key=lambda x: x["score"], reverse=True)
    return rankings


@router.get("/{category}", response_model=RankingListResponse)
async def get_rankings(
    category: str,
    period: str = Query("all_time", description="daily, weekly, monthly, all_time"),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """랭킹 조회"""
    # 기간 계산
    now = datetime.now()
    period_start = None
    period_end = None
    
    if period == "daily":
        period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = period_start + timedelta(days=1)
    elif period == "weekly":
        period_start = now - timedelta(days=now.weekday())
        period_start = period_start.replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = period_start + timedelta(days=7)
    elif period == "monthly":
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if period_start.month == 12:
            period_end = period_start.replace(year=period_start.year + 1, month=1)
        else:
            period_end = period_start.replace(month=period_start.month + 1)
    elif period == "all_time":
        period_start = None
        period_end = None
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid period")

    # 랭킹 계산
    rankings = calculate_rankings(category, db)
    
    if not rankings:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")
    
    # 랭킹 번호 부여
    result = []
    for rank, item in enumerate(rankings[:limit], 1):
        result.append(RankingResponse(
            id=str(uuid.uuid4()),
            user_id=item["user_id"],
            category=category,
            rank=rank,
            score=item["score"],
            period=period,
            period_start=period_start,
            period_end=period_end,
            user={"id": item["user_id"], "username": item["username"]},
            created_at=now,
            updated_at=now,
        ))

    return RankingListResponse(
        category=category,
        period=period,
        rankings=result,
        total=len(result),
    )


@router.get("/user/me", response_model=RankingResponse)
async def get_my_ranking(
    category: str = Query("overall"),
    period: str = Query("all_time"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """내 랭킹 조회"""
    # 기간 계산
    now = datetime.now()
    period_start = None
    period_end = None
    
    if period == "daily":
        period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = period_start + timedelta(days=1)
    elif period == "weekly":
        period_start = now - timedelta(days=now.weekday())
        period_start = period_start.replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = period_start + timedelta(days=7)
    elif period == "monthly":
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if period_start.month == 12:
            period_end = period_start.replace(year=period_start.year + 1, month=1)
        else:
            period_end = period_start.replace(month=period_start.month + 1)
    elif period == "all_time":
        period_start = None
        period_end = None
    
    # 내 점수 계산
    rankings = calculate_rankings(category, db)
    
    # 내 순위 찾기
    my_rank = 0
    my_score = 0
    for rank, item in enumerate(rankings, 1):
        if item["user_id"] == current_user.id:
            my_rank = rank
            my_score = item["score"]
            break
    
    # 랭킹에 없으면 기본값 반환
    if my_rank == 0:
        my_rank = len(rankings) + 1
        # 내 점수 계산
        if category == "overall":
            spiritlings = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).all()
            total_level = sum(s.level for s in spiritlings)
            total_stats = sum(
                (s.health_stat or 0) + 
                (s.agility_stat or 0) + 
                (s.intelligence_stat or 0) + 
                (s.friendliness_stat or 0) + 
                (s.resilience_stat or 0) + 
                (s.luck_stat or 0) 
                for s in spiritlings
            )
            my_score = total_level * 10 + total_stats + current_user.coins
        elif category == "level":
            spiritlings = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).all()
            my_score = max([s.level for s in spiritlings], default=0)
        elif category == "coins":
            my_score = current_user.coins
        elif category == "spiritlings":
            my_score = db.query(Spiritling).filter(Spiritling.user_id == current_user.id).count()
    
    return RankingResponse(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        category=category,
        rank=my_rank,
        score=my_score,
        period=period,
        period_start=period_start,
        period_end=period_end,
        user={"id": current_user.id, "username": current_user.username},
        created_at=now,
        updated_at=now,
    )
