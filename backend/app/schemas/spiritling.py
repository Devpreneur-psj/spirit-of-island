from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class Stats(BaseModel):
    health: int
    agility: int
    intelligence: int
    friendliness: int
    resilience: int
    luck: int


class Status(BaseModel):
    hunger: int  # 0-100
    happiness: int  # 0-100
    energy: int  # 0-100
    health: int  # 0-100
    cleanliness: int  # 0-100


class SpiritlingBase(BaseModel):
    name: str
    element: str
    personality: str


class SpiritlingCreate(SpiritlingBase):
    pass


class SpiritlingUpdate(BaseModel):
    name: Optional[str] = None
    hunger: Optional[int] = None
    happiness: Optional[int] = None
    energy: Optional[int] = None
    health: Optional[int] = None
    cleanliness: Optional[int] = None
    experience: Optional[int] = None
    level: Optional[int] = None
    current_action: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None


class SpiritlingResponse(SpiritlingBase):
    id: str
    growth_stage: str
    level: int
    experience: int
    health_stat: int
    agility_stat: int
    intelligence_stat: int
    friendliness_stat: int
    resilience_stat: int
    luck_stat: int
    hunger: int
    happiness: int
    energy: int
    health_status: int
    cleanliness: int
    current_action: str
    action_data: Dict[str, Any]
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Spiritling(SpiritlingResponse):
    pass

