from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)  # race, puzzle, battle, fashion
    name = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    rewards = Column(JSON)  # {first: [...], second: [...], third: [...]}
    status = Column(String, default="upcoming")  # upcoming, active, ended

    # 관계
    entries = relationship("CompetitionEntry", back_populates="competition")

