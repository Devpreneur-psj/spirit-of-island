import pytest
from app.models.spiritling import Spiritling
from app.models.competition import Competition
from datetime import datetime, timedelta
import uuid


@pytest.fixture
def test_spiritling(db, test_user):
    """테스트용 마정령 생성"""
    spiritling = Spiritling(
        id=str(uuid.uuid4()),
        name="Testling",
        element="fire",
        personality="playful",
        level=10,
        health_stat=80,
        agility_stat=70,
        user_id=test_user.id
    )
    db.add(spiritling)
    db.commit()
    db.refresh(spiritling)
    return spiritling


@pytest.fixture
def test_competition(db):
    """테스트용 대회 생성"""
    competition = Competition(
        id=str(uuid.uuid4()),
        name="Test Competition",
        type="race",
        description="Test competition",
        start_date=datetime.now() - timedelta(days=1),
        end_date=datetime.now() + timedelta(days=1),
        status="active"
    )
    db.add(competition)
    db.commit()
    db.refresh(competition)
    return competition


def test_get_competitions(client, db, test_competition):
    """대회 목록 조회 테스트"""
    response = client.get("/api/v1/competitions")
    assert response.status_code == 200
    assert len(response.json()) > 0


def test_enter_competition(client, db, test_user, test_spiritling, test_competition):
    """대회 참가 테스트"""
    response = client.post(
        f"/api/v1/competitions/{test_competition.id}/enter",
        json={
            "spiritling_id": test_spiritling.id
        }
    )
    assert response.status_code == 200
    assert "score" in response.json()


def test_get_competition_ranking(client, db, test_user, test_spiritling, test_competition):
    """대회 랭킹 조회 테스트"""
    # Enter competition first
    client.post(
        f"/api/v1/competitions/{test_competition.id}/enter",
        json={
            "spiritling_id": test_spiritling.id
        }
    )
    
    response = client.get(f"/api/v1/competitions/{test_competition.id}/ranking")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert "rank" in response.json()[0]
        assert "score" in response.json()[0]
