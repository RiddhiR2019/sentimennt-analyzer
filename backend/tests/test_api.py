import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Sentiment Analyzer API", "status": "running"}


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_sentiment_analysis_positive():
    response = client.post("/api/sentiment", json={"text": "I love this product, it's amazing!"})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "score" in data
    assert "details" in data
    assert data["sentiment"] == "Positive"


def test_sentiment_analysis_negative():
    response = client.post("/api/sentiment", json={"text": "This is terrible and frustrating."})
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "Negative"


def test_sentiment_analysis_empty_text():
    response = client.post("/api/sentiment", json={"text": ""})
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "Unknown"
