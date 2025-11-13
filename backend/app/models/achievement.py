from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g., "level", "collection", "stat", "coins"
    requirement = Column(JSON, nullable=False)  # e.g., {"level": 10}, {"count": 5}, {"stat": "health", "value": 50}
    reward = Column(JSON, nullable=False)  # e.g., {"coins": 100, "items": [{"item_id": "xyz", "quantity": 1}]}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(String, ForeignKey("achievements.id"), nullable=False)
    progress = Column(JSON, default={})  # 진행 상황
    completed = Column(String, default="false")  # true, false
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 관계
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")

