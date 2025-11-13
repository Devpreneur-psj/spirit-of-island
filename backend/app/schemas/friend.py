from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FriendBase(BaseModel):
    friend_id: str


class FriendCreate(FriendBase):
    pass


class FriendResponse(BaseModel):
    id: str
    user_id: str
    friend_id: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FriendRequestResponse(BaseModel):
    id: str
    user_id: str
    friend_id: str
    username: str
    email: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FriendAccept(BaseModel):
    friend_request_id: str


class FriendReject(BaseModel):
    friend_request_id: str

