from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    coins = Column(Integer, default=1000)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 관계
    spiritlings = relationship("Spiritling", back_populates="owner", cascade="all, delete-orphan")
    items = relationship("UserItem", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    event_participations = relationship("EventParticipation", back_populates="user", cascade="all, delete-orphan")
    rankings = relationship("Ranking", back_populates="user", cascade="all, delete-orphan")

