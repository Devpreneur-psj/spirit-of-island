from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_user_info(current_user: User = Depends(get_current_user)):
    """사용자 정보 조회"""
    return current_user

