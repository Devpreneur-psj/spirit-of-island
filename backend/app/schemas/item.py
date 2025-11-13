from pydantic import BaseModel
from typing import Dict, Any, Optional


class ItemBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    effect: Dict[str, Any]
    price: int
    rarity: str


class Item(ItemBase):
    id: str

    class Config:
        from_attributes = True


class ItemResponse(Item):
    pass

