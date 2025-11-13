from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime
import uuid
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.competition import Competition
from app.models.competition_entry import CompetitionEntry
from app.models.spiritling import Spiritling
from app.schemas.competition import CompetitionResponse, CompetitionEntryCreate, CompetitionEntry

router = APIRouter()


@router.get("", response_model=List[CompetitionResponse])
async def get_competitions(db: Session = Depends(get_db)):
    """대회 목록 조회"""
    competitions = db.query(Competition).filter(
        Competition.status.in_(["upcoming", "active"])
    ).all()
    return competitions


@router.get("/{competition_id}", response_model=CompetitionResponse)
async def get_competition(competition_id: str, db: Session = Depends(get_db)):
    """대회 상세 조회"""
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대회를 찾을 수 없습니다."
        )
    return competition


@router.get("/{competition_id}/ranking", response_model=List[dict])
async def get_competition_ranking(
    competition_id: str,
    db: Session = Depends(get_db)
):
    """대회 랭킹 조회"""
    entries = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id
    ).order_by(desc(CompetitionEntry.score)).limit(10).all()
    
    result = []
    for idx, entry in enumerate(entries, 1):
        spiritling = db.query(Spiritling).filter(Spiritling.id == entry.spiritling_id).first()
        if spiritling:
            result.append({
                "rank": idx,
                "spiritling_id": spiritling.id,
                "spiritling_name": spiritling.name,
                "score": entry.score,
            })
    
    return result


@router.post("/{competition_id}/enter", response_model=CompetitionEntry)
async def enter_competition(
    competition_id: str,
    entry_data: CompetitionEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """대회 참가"""
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대회를 찾을 수 없습니다."
        )
    
    # 대회 상태 확인
    if competition.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 참가 가능한 대회가 아닙니다."
        )
    
    # 마정령 소유권 확인
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == entry_data.spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 중복 참가 확인
    existing_entry = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id,
        CompetitionEntry.spiritling_id == entry_data.spiritling_id
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 참가한 대회입니다."
        )
    
    # 점수 계산 (대회 타입에 따라)
    score = _calculate_score(spiritling, competition.type, entry_data.score)
    
    new_entry = CompetitionEntry(
        id=str(uuid.uuid4()),
        competition_id=competition_id,
        spiritling_id=entry_data.spiritling_id,
        score=score
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    # 랭킹 업데이트
    _update_ranking(competition_id, db)
    
    return new_entry


def _calculate_score(spiritling: Spiritling, competition_type: str, base_score: float = 0.0) -> float:
    """대회 타입에 따라 점수 계산"""
    if competition_type == "race":
        # 경주: 민첩 + 운
        return float(spiritling.agility_stat * 0.7 + spiritling.luck_stat * 0.3) + base_score
    elif competition_type == "puzzle":
        # 퍼즐: 지능 + 근성
        return float(spiritling.intelligence_stat * 0.8 + spiritling.resilience_stat * 0.2) + base_score
    elif competition_type == "battle":
        # 전투: 체력 + 근성 + 민첩
        return float(spiritling.health_stat * 0.4 + spiritling.resilience_stat * 0.3 + spiritling.agility_stat * 0.3) + base_score
    elif competition_type == "fashion":
        # 코디: 친근함 + 운
        return float(spiritling.friendliness_stat * 0.6 + spiritling.luck_stat * 0.4) + base_score
    else:
        # 기본: 모든 스탯 평균
        total_stat = float(
            spiritling.health_stat +
            spiritling.agility_stat +
            spiritling.intelligence_stat +
            spiritling.friendliness_stat +
            spiritling.resilience_stat +
            spiritling.luck_stat
        )
        return (total_stat / 6.0) + base_score


def _update_ranking(competition_id: str, db: Session):
    """대회 랭킹 업데이트"""
    entries = db.query(CompetitionEntry).filter(
        CompetitionEntry.competition_id == competition_id
    ).order_by(desc(CompetitionEntry.score)).all()
    
    for idx, entry in enumerate(entries, 1):
        entry.rank = idx
    
    db.commit()

