from sqlalchemy import Column, String, Text, Integer, DateTime, func, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    reward = Column(JSON, nullable=False)  # e.g., {"coins": 200, "items": [{"item_id": "xyz", "quantity": 1}]}
    status = Column(String, default="upcoming")  # upcoming, active, ended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class EventParticipation(Base):
    __tablename__ = "event_participations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_id = Column(String, ForeignKey("events.id"), nullable=False)
    participated_at = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(JSON, default={})  # 이벤트 내 점수 또는 진행 상황
    reward_claimed = Column(String, default="false")  # "true" or "false"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 관계
    user = relationship("User", back_populates="event_participations")
    event = relationship("Event")

