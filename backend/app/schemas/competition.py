from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class CompetitionBase(BaseModel):
    type: str
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    rewards: Dict[str, List[Any]]


class Competition(CompetitionBase):
    id: str
    status: str

    class Config:
        from_attributes = True


class CompetitionResponse(Competition):
    pass


class CompetitionEntryBase(BaseModel):
    competition_id: str
    spiritling_id: str
    score: float = 0


class CompetitionEntryCreate(CompetitionEntryBase):
    pass


class CompetitionEntry(CompetitionEntryBase):
    id: str
    rank: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

