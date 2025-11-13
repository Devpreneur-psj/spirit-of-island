from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.action_log import ActionLog
from app.models.spiritling import Spiritling
from app.schemas.action_log import ActionLogResponse

router = APIRouter()


@router.get("/spiritling/{spiritling_id}", response_model=List[ActionLogResponse])
async def get_spiritling_action_logs(
    spiritling_id: str,
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마정령 행동 로그 조회"""
    # 마정령 소유권 확인
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 행동 로그 조회 (최신순)
    logs = db.query(ActionLog).filter(
        ActionLog.spiritling_id == spiritling_id
    ).order_by(desc(ActionLog.created_at)).limit(limit).all()
    
    return logs

