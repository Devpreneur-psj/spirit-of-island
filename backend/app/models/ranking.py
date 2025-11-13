from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Ranking(Base):
    __tablename__ = "rankings"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)  # overall, level, coins, battles, etc.
    rank = Column(Integer, nullable=False)
    score = Column(Integer, default=0)  # 랭킹 점수
    period = Column(String)  # daily, weekly, monthly, all_time
    period_start = Column(DateTime(timezone=True))
    period_end = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 관계
    user = relationship("User", back_populates="rankings")

