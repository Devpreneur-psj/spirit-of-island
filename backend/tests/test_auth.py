import pytest
from fastapi.testclient import TestClient


def test_register_user(client):
    """사용자 등록 테스트"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"


def test_register_duplicate_email(client):
    """중복 이메일 등록 테스트"""
    # First registration
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    
    # Second registration with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "anotheruser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 400


def test_login_user(client):
    """사용자 로그인 테스트"""
    # First register
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "testuser",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    """잘못된 자격 증명 로그인 테스트"""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "nonexistent",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "detail" in response.json()


def test_get_current_user(client):
    """현재 사용자 정보 조회 테스트"""
    # Register and login first
    client.post(
        "/api/v1/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "testuser",
            "password": "testpassword123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

