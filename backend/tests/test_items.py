import pytest
from app.models.item import Item
from app.models.user_item import UserItem
import uuid


@pytest.fixture
def test_item(db):
    """테스트용 아이템 생성"""
    item = Item(
        id=str(uuid.uuid4()),
        name="Test Food",
        type="food",
        description="Test food item",
        effect={"status": "hunger", "value": 20},
        price=100,
        rarity="common"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def test_get_items(client, db, test_item):
    """아이템 목록 조회 테스트"""
    response = client.get("/api/v1/items")
    assert response.status_code == 200
    assert len(response.json()) > 0


def test_buy_item(client, db, test_user, test_item):
    """아이템 구매 테스트"""
    initial_coins = test_user.coins
    response = client.post(
        f"/api/v1/user-items/{test_item.id}/buy?quantity=1"
    )
    assert response.status_code == 200
    # Check if coins decreased
    db.refresh(test_user)
    assert test_user.coins < initial_coins


def test_get_user_items(client, db, test_user, test_item):
    """사용자 아이템 목록 조회 테스트"""
    # Buy an item first
    user_item = UserItem(
        id=str(uuid.uuid4()),
        user_id=test_user.id,
        item_id=test_item.id,
        quantity=5
    )
    db.add(user_item)
    db.commit()
    
    response = client.get("/api/v1/user-items")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["quantity"] == 5
