from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.user_item import UserItem
from app.models.item import Item
from app.models.spiritling import Spiritling
from app.schemas.item import ItemResponse
from app.schemas.spiritling import SpiritlingResponse

router = APIRouter()


@router.get("", response_model=List[dict])
async def get_user_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자 아이템 목록 조회"""
    user_items = db.query(UserItem).filter(UserItem.user_id == current_user.id).all()
    result = []
    for user_item in user_items:
        item = db.query(Item).filter(Item.id == user_item.item_id).first()
        if item:
            result.append({
                "id": user_item.id,
                "item_id": item.id,
                "name": item.name,
                "type": item.type,
                "description": item.description,
                "effect": item.effect,
                "price": item.price,
                "rarity": item.rarity,
                "quantity": user_item.quantity,
            })
    return result


@router.post("/{item_id}/buy")
async def buy_item(
    item_id: str,
    quantity: int = Query(1, ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """아이템 구매"""
    
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="아이템을 찾을 수 없습니다."
        )
    
    total_price = item.price * quantity
    if current_user.coins < total_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"코인이 부족합니다. 필요: {total_price}, 보유: {current_user.coins}"
        )
    
    # 코인 차감
    current_user.coins -= total_price
    
    # 사용자 아이템 추가 또는 수량 증가
    user_item = db.query(UserItem).filter(
        UserItem.user_id == current_user.id,
        UserItem.item_id == item_id
    ).first()
    
    if user_item:
        user_item.quantity += quantity
    else:
        import uuid
        user_item = UserItem(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            item_id=item_id,
            quantity=quantity
        )
        db.add(user_item)
    
    db.commit()
    db.refresh(current_user)
    db.refresh(user_item)
    
    return {
        "message": f"{item.name} {quantity}개를 구매했습니다.",
        "coins": current_user.coins,
        "item": {
            "id": user_item.id,
            "item_id": item.id,
            "name": item.name,
            "quantity": user_item.quantity,
        }
    }


class UseItemRequest(BaseModel):
    spiritling_id: str
    quantity: int = 1


@router.post("/{item_id}/use", response_model=dict)
async def use_item(
    item_id: str,
    request: UseItemRequest = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """아이템 사용"""
    # 사용자 아이템 확인
    user_item = db.query(UserItem).filter(
        UserItem.user_id == current_user.id,
        UserItem.item_id == item_id
    ).first()
    
    if not user_item or user_item.quantity < request.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="아이템이 부족합니다."
        )
    
    # 아이템 정보 가져오기
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="아이템을 찾을 수 없습니다."
        )
    
    # 마정령 확인
    spiritling = db.query(Spiritling).filter(
        Spiritling.id == request.spiritling_id,
        Spiritling.user_id == current_user.id
    ).first()
    
    if not spiritling:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="마정령을 찾을 수 없습니다."
        )
    
    # 아이템 효과 적용
    effect = item.effect
    if "stat" in effect:
        stat_attr = f"{effect['stat']}_stat"
        if hasattr(spiritling, stat_attr):
            current_stat = getattr(spiritling, stat_attr)
            setattr(spiritling, stat_attr, min(100, current_stat + effect['value'] * request.quantity))
    
    if "status" in effect:
        status_attr = effect['status']
        if hasattr(spiritling, status_attr):
            current_status = getattr(spiritling, status_attr)
            setattr(spiritling, status_attr, min(100, current_status + effect['value'] * request.quantity))
    
    # 경험치 증가
    spiritling.experience += 2 * request.quantity
    
    # 레벨 업 체크 및 성장 단계 업데이트
    from app.utils.spiritling_utils import check_level_up
    leveled_up = check_level_up(spiritling)
    
    # 행동 로그 생성
    message = f"{spiritling.name}에게 {item.name} {request.quantity}개를 사용했습니다."
    if leveled_up:
        message += f" (레벨 업! 레벨 {spiritling.level})"
    create_action_log(db, spiritling.id, "use_item", message)
    
    # 아이템 수량 감소
    user_item.quantity -= request.quantity
    if user_item.quantity <= 0:
        db.delete(user_item)
    
    db.commit()
    db.refresh(spiritling)
    
    return {
        "message": f"{item.name} {request.quantity}개를 사용했습니다.",
        "spiritling": SpiritlingResponse.model_validate(spiritling)
    }

