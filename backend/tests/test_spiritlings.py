import pytest
from app.models.spiritling import Spiritling
import uuid


def test_create_spiritling(client, db, test_user):
    """마정령 생성 테스트"""
    response = client.post(
        "/api/v1/spiritlings",
        json={
            "name": "Testling",
            "element": "fire",
            "personality": "playful"
        }
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Testling"
    assert response.json()["element"] == "fire"
    assert response.json()["level"] == 1


def test_get_spiritlings(client, db, test_user):
    """마정령 목록 조회 테스트"""
    # Create a spiritling first
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    
    response = client.get("/api/v1/spiritlings")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Testling"


def test_get_spiritling(client, db, test_user):
    """마정령 상세 조회 테스트"""
    # Create a spiritling first
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    
    response = client.get(f"/api/v1/spiritlings/{spiritling.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Testling"


def test_feed_spiritling(client, db, test_user):
    """마정령 먹이주기 테스트"""
    # Create a spiritling first
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        hunger=50,
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    
    response = client.post(f"/api/v1/spiritlings/{spiritling.id}/feed")
    assert response.status_code == 200
    assert response.json()["hunger"] > 50


def test_play_with_spiritling(client, db, test_user):
    """마정령 놀기 테스트"""
    # Create a spiritling first
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        happiness=50,
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    
    response = client.post(f"/api/v1/spiritlings/{spiritling.id}/play")
    assert response.status_code == 200
    assert response.json()["happiness"] > 50


def test_train_spiritling(client, db, test_user):
    """마정령 훈련 테스트"""
    # Create a spiritling first
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        energy=100,
        health_stat=50,
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    
    response = client.post(
        f"/api/v1/spiritlings/{spiritling.id}/train?stat_type=health"
    )
    assert response.status_code == 200
    assert response.json()["health_stat"] > 50
    assert response.json()["energy"] < 100
