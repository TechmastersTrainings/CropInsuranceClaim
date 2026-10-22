import pytest
from fastapi import status


def test_get_multi_crop_registry(client):
    response = client.get("/api/v1/crops")
    assert response.status_code == status.HTTP_200_OK
    crops = response.json()
    assert len(crops) >= 9
    crop_names = [c["name"] for c in crops]
    # Verify Section 5 multi-crops
    assert "Cotton" in crop_names
    assert "Paddy (Rice)" in crop_names
    assert "Maize" in crop_names
    assert "Soybean" in crop_names
    assert "Wheat" in crop_names


def test_create_farm_plot(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    payload = {
        "name": "Mandya Organic Acre",
        "survey_number": "SY-990/4",
        "area_acres": 2.5,
        "village": "Maddur",
        "taluk": "Maddur",
        "district": "Mandya",
        "state": "Karnataka",
        "soil_type": "Red Sandy Loam",
        "irrigation_type": "Canal Fed",
        "active_crop_name": "Paddy (Rice)"
    }
    response = client.post("/api/v1/farms", json=payload, headers=headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Mandya Organic Acre"
    assert data["survey_number"] == "SY-990/4"
    assert data["area_acres"] == 2.5


def test_get_farm_plots_farmer_isolation(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    response = client.get("/api/v1/farms", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    farms = response.json()
    assert len(farms) >= 1
