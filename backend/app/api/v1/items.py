from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.item import Item
from app.schemas.item import ItemResponse

router = APIRouter()


@router.get("", response_model=List[ItemResponse])
async def get_items(db: Session = Depends(get_db)):
    """아이템 목록 조회"""
    items = db.query(Item).all()
    return items


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str, db: Session = Depends(get_db)):
    """아이템 상세 조회"""
    item = db.query(Item).filter(Item.id == item_id).first()
    return item

