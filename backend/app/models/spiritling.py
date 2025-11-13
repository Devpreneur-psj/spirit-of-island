from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, func, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Spiritling(Base):
    __tablename__ = "spiritlings"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    element = Column(String, nullable=False)  # fire, water, wind, etc.
    personality = Column(String, nullable=False)
    growth_stage = Column(String, default="egg")
    level = Column(Integer, default=1)
    experience = Column(Integer, default=0)

    # 스탯
    health_stat = Column(Integer, default=10)
    agility_stat = Column(Integer, default=10)
    intelligence_stat = Column(Integer, default=10)
    friendliness_stat = Column(Integer, default=10)
    resilience_stat = Column(Integer, default=10)
    luck_stat = Column(Integer, default=10)

    # 상태
    hunger = Column(Integer, default=100)  # 0-100
    happiness = Column(Integer, default=100)  # 0-100
    energy = Column(Integer, default=100)  # 0-100
    health_status = Column(Integer, default=100)  # 0-100
    cleanliness = Column(Integer, default=100)  # 0-100

    # 자율 행동 AI 상태
    current_action = Column(String, default="idle")
    action_data = Column(JSON, default={})

    # 관계
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="spiritlings")
    action_logs = relationship("ActionLog", back_populates="spiritling", cascade="all, delete-orphan")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

