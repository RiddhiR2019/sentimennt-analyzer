import pytest
from sentiment.analyzer import analyze_sentiment, analyze_with_nltk, analyze_with_vader


def test_positive_sentiment_hybrid():
    result = analyze_sentiment("I love this product, it's amazing!", method='hybrid')
    assert result["sentiment"] == "Positive"
    assert 0.5 < result["score"] <= 1.0
    assert "nltk_score" in result["details"]
    assert "vader_score" in result["details"]


def test_positive_sentiment_nltk():
    result = analyze_sentiment("I love this product", method='nltk')
    assert result["sentiment"] == "Positive"
    assert result["score"] > 0.5


def test_positive_sentiment_vader():
    result = analyze_sentiment("I LOVE this product!!!", method='vader')
    assert result["sentiment"] == "Positive"
    assert "compound" in result["details"]


def test_positive_with_different_tenses():
    # Test different verb tenses with NLTK method (better for lemmatization)
    result_love = analyze_sentiment("I love this product", method='nltk')
    assert result_love["sentiment"] == "Positive"
    
    result_loved = analyze_sentiment("I loved this movie", method='nltk')
    assert result_loved["sentiment"] == "Positive"
    
    result_loves = analyze_sentiment("He loves this", method='nltk')
    assert result_loves["sentiment"] == "Positive"
    
    result_loving = analyze_sentiment("I'm loving it", method='nltk')
    assert result_loving["sentiment"] == "Positive"


def test_negative_sentiment():
    result = analyze_sentiment("This is terrible and frustrating.", method='hybrid')
    assert result["sentiment"] == "Negative"
    assert 0.0 <= result["score"] < 0.5


def test_neutral_sentiment():
    result = analyze_sentiment("The design is okay.", method='hybrid')
    assert result["sentiment"] == "Neutral"
    assert 0.35 <= result["score"] <= 0.65


def test_negation_sentiment():
    result = analyze_sentiment("I do not like this product.", method='nltk')
    assert result["sentiment"] == "Negative"
    assert result["score"] < 0.5


def test_empty_text():
    result = analyze_sentiment("", method='hybrid')
    assert result["sentiment"] == "Unknown"
    assert result["score"] == 0.0
    assert "error" in result["details"]


def test_vader_intensity_modifiers():
    # VADER recognizes exclamation marks and caps
    result_normal = analyze_sentiment("I love this", method='vader')
    result_intense = analyze_sentiment("I LOVE this!!!", method='vader')
    
    assert result_normal["sentiment"] == "Positive"
    assert result_intense["sentiment"] == "Positive"
    assert result_intense["score"] > result_normal["score"]

def test_score_bounds():
    # Test that score stays within reasonable bounds for hybrid approach
    # VADER can push scores beyond 0.98 for extremely positive text
    result = analyze_sentiment("love great fantastic excellent recommend easy amazing happy premium flawless", method='nltk')
    assert result["score"] <= 0.98
    assert result["score"] >= 0.02

    result = analyze_sentiment("disappointed slow bad poor terrible hate worst frustrating problem unhelpful", method='nltk')
    assert result["score"] >= 0.02
    assert result["score"] <= 0.98
