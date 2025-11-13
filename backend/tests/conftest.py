"""
Pytest 설정 및 공통 fixtures
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User
import uuid


# 테스트용 데이터베이스 URL (메모리 SQLite 사용)
TEST_DATABASE_URL = "sqlite:///:memory:"

# 테스트용 엔진 생성
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db():
    """테스트용 데이터베이스 세션"""
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def test_user(db):
    """테스트용 사용자 생성"""
    from app.core.security import get_password_hash
    user = User(
        id=str(uuid.uuid4()),
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        coins=1000
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def client(db, test_user):
    """테스트용 클라이언트 생성"""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    def override_get_current_user():
        return test_user
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    # 인증 토큰 가져오기
    with TestClient(app) as test_client:
        login_response = test_client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "testpassword123"
            }
        )
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            test_client.headers = {"Authorization": f"Bearer {token}"}
        else:
            # 사용자가 없으면 생성
            test_client.post(
                "/api/v1/auth/register",
                json={
                    "username": "testuser",
                    "email": "test@example.com",
                    "password": "testpassword123"
                }
            )
            login_response = test_client.post(
                "/api/v1/auth/login",
                json={
                    "username": "testuser",
                    "password": "testpassword123"
                }
            )
            token = login_response.json().get("access_token")
            test_client.headers = {"Authorization": f"Bearer {token}"}
        
        yield test_client
    
    app.dependency_overrides.clear()

