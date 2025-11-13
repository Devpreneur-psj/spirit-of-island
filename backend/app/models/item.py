from sqlalchemy import Column, String, Integer, Text, JSON
from app.core.database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # food, vitamin, toy, medicine, accessory
    description = Column(Text)
    effect = Column(JSON)  # {stat: "health", value: 10} or {status: "hunger", value: 20}
    price = Column(Integer, default=0)
    rarity = Column(String, default="common")  # common, rare, epic, legendary

