from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RankingBase(BaseModel):
    user_id: str
    category: str
    rank: int
    score: int = 0
    period: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None


class RankingResponse(RankingBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: Optional[dict] = None  # User 정보 (username 등)

    class Config:
        from_attributes = True


class RankingListResponse(BaseModel):
    category: str
    period: str
    rankings: list[RankingResponse]
    total: int

    class Config:
        from_attributes = True

