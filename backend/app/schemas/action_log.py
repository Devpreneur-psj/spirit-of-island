from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActionLogBase(BaseModel):
    action_type: str
    message: str


class ActionLogCreate(ActionLogBase):
    spiritling_id: str


class ActionLogResponse(ActionLogBase):
    id: str
    spiritling_id: str
    created_at: datetime

    class Config:
        from_attributes = True

