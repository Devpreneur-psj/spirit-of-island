from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class CompetitionEntry(Base):
    __tablename__ = "competition_entries"

    id = Column(String, primary_key=True, index=True)
    competition_id = Column(String, ForeignKey("competitions.id"), nullable=False)
    spiritling_id = Column(String, ForeignKey("spiritlings.id"), nullable=False)
    score = Column(Float, default=0)
    rank = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 관계
    competition = relationship("Competition", back_populates="entries")
    spiritling = relationship("Spiritling")

