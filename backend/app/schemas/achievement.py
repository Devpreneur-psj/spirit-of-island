from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AchievementBase(BaseModel):
    name: str
    description: str
    category: str
    requirement: Dict[str, Any]
    reward: Dict[str, Any]


class AchievementCreate(AchievementBase):
    pass


class AchievementResponse(AchievementBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserAchievementBase(BaseModel):
    user_id: str
    achievement_id: str
    progress: Dict[str, Any] = {}
    completed: str = "false"
    completed_at: Optional[datetime] = None


class UserAchievementResponse(UserAchievementBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    achievement: Optional[AchievementResponse] = None

    class Config:
        from_attributes = True

