from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(String, primary_key=True, index=True)
    spiritling_id = Column(String, ForeignKey("spiritlings.id"), nullable=False)
    action_type = Column(String, nullable=False)  # feed, play, heal, clean, train, auto_eat, auto_play, etc.
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 관계
    spiritling = relationship("Spiritling", back_populates="action_logs")

