from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class EventBase(BaseModel):
    name: str
    description: str
    start_time: datetime
    end_time: datetime
    reward: Dict[str, Any]
    status: str


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EventParticipationBase(BaseModel):
    user_id: str
    event_id: str
    participated_at: datetime
    score: Dict[str, Any] = {}
    reward_claimed: str  # "true" or "false"


class EventParticipationResponse(EventParticipationBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    event: Optional[EventResponse] = None

    class Config:
        from_attributes = True

