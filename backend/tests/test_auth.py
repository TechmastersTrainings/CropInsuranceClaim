import pytest
from fastapi import status


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert data["database"] == "connected"


def test_user_registration_success(client):
    payload = {
        "email": "new.farmer@agrishield.org",
        "full_name": "Suresh Gowda",
        "password": "securepassword123",
        "role": "FARMER",
        "phone": "+91 99000 11223",
        "district": "Hassan",
        "state": "Karnataka"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "new.farmer@agrishield.org"
    assert data["full_name"] == "Suresh Gowda"
    assert data["role"] == "FARMER"


def test_duplicate_registration_rejected(client):
    payload = {
        "email": "patil.farmer@agrishield.org",
        "full_name": "Duplicate Patil",
        "password": "password123",
        "role": "FARMER"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]


def test_login_success_and_jwt_issuance(client):
    payload = {
        "email": "patil.farmer@agrishield.org",
        "password": "farmer123"
    }
    response = client.post("/api/v1/auth/login-json", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "patil.farmer@agrishield.org"


def test_login_invalid_password_rejected(client):
    payload = {
        "email": "patil.farmer@agrishield.org",
        "password": "wrong_password"
    }
    response = client.post("/api/v1/auth/login-json", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_me_profile(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "patil.farmer@agrishield.org"
    assert data["role"] == "FARMER"
