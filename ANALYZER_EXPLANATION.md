# Sentiment Analyzer Code Explanation

This document explains the code in `analyzer.py`, which is the core of the Sentiment Analyzer application. It provides three different approaches to analyze sentiment: **NLTK**, **VADER**, and **Hybrid**.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Classes](#key-classes)
3. [Main Functions](#main-functions)
4. [Three Analysis Methods](#three-analysis-methods)
5. [How Negation Works](#how-negation-works)
6. [Example Usage](#example-usage)

---

## Overview

The `analyzer.py` module processes text and determines whether it expresses **positive**, **negative**, or **neutral** sentiment. It uses two state-of-the-art NLP libraries:

- **NLTK** (Natural Language Toolkit): Rule-based approach using word lists and lemmatization
- **VADER** (Valence Aware Dictionary and sEntiment Reasoner): Lexicon-based approach optimized for social media

### Key Features

✅ Handles negation (e.g., "not good" = negative)  
✅ Three independent analysis methods for comparison  
✅ Returns confidence scores (0-1 range)  
✅ Provides detailed analysis breakdown  

---

## Key Classes

### 1. **NLTKLemmatizer**

A wrapper class around NLTK's lemmatization functionality.

```python
class NLTKLemmatizer:
    """Wrapper for NLTK-based lemmatization."""
```

#### Methods:

- **`__init__()`**: Initializes the WordNetLemmatizer
  
- **`get_wordnet_pos(treebank_tag: str) -> str`**
  - Converts POS (Part-of-Speech) tags from Penn Treebank format to WordNet format
  - Maps: J → ADJ, V → VERB, N → NOUN, R → ADV
  - Why? Because lemmatization depends on knowing if a word is a verb, noun, etc.

- **`lemmatize(word: str, pos: str) -> str`**
  - Reduces words to their base form (lemma)
  - Example: "running" → "run", "better" → "good"
  - Uses the provided POS tag for accurate lemmatization

- **`process_text(text: str) -> list`**
  - **Complete text processing pipeline:**
    1. Tokenizes text into words
    2. Tags each word with its POS
    3. Lemmatizes each word based on its POS
    4. Returns list of lemmatized tokens
  - Example: "I loved running" → ["i", "love", "run"]

---

### 2. **SentimentAnalyzerConfig**

A configuration class storing sentiment resources.

```python
class SentimentAnalyzerConfig:
    """Configuration for sentiment analysis with NLTK and VADER."""
```

#### Key Data:

- **`positive_words`** (27 words)
  - Examples: love, like, great, fantastic, excellent, amazing, awesome, wonderful, perfect
  - Words that indicate positive sentiment

- **`negative_words`** (23 words)
  - Examples: disappointed, slow, bad, poor, terrible, hate, worst, frustrating, awful
  - Words that indicate negative sentiment

- **`lemmatizer`** (instance of NLTKLemmatizer)
  - Shared instance used across the module

- **`vader_analyzer`** (SentimentIntensityAnalyzer instance)
  - VADER's pre-trained sentiment analyzer

---

## Main Functions

### 1. **is_negated(word: str, tokens: list) -> bool**

Detects if a sentiment word is negated.

```python
def is_negated(word: str, tokens: list) -> bool:
    """Check if a sentiment word is preceded by negation within a token window."""
```

**How it works:**

1. Finds the word's position in the token list
2. Checks the **4 tokens before** the word (window = -4 to current)
3. Looks for negation words: not, no, never, don't, doesn't, etc.
4. Returns `True` if negation found

**Example:**

```
Text: "This product is not good"
Tokens: ["this", "product", "is", "not", "good"]

Word "good" at index 4
Window: ["this", "product", "is", "not"]
Found "not" → NEGATED = True → Score reduced
```

---

### 2. **analyze_with_nltk(text: str) -> float**

Rule-based sentiment analysis using lemmatization.

```python
def analyze_with_nltk(text: str) -> float:
    """Analyze sentiment using NLTK lemmatization with negation handling."""
```

**Algorithm:**

1. **Start with neutral score**: `score = 0.5` (range: 0.0 to 1.0)

2. **Process positive words:**
   - For each positive word in the list, check if it appears in the text
   - If found and NOT negated: `score += 0.16`
   - If found and negated: `score -= 0.16`

3. **Process negative words:**
   - For each negative word in the list, check if it appears in the text
   - If found and NOT negated: `score -= 0.16`
   - If found and negated: `score += 0.16`

4. **Clamp score**: Ensure it stays between 0.02 and 0.98

**Example:**

```
Text: "I love this product"
Tokens after lemmatization: ["i", "love", "this", "product"]

- Check positive words: "love" found, not negated
  score = 0.5 + 0.16 = 0.66 → "Positive"
- Check negative words: none found
- Final score: 0.66
```

---

### 3. **analyze_with_vader(text: str) -> Dict**

Lexicon-based sentiment analysis using pre-trained VADER model.

```python
def analyze_with_vader(text: str) -> Dict[str, float]:
    """Analyze sentiment using VADER."""
```

**How VADER works:**

- Uses a pre-built sentiment lexicon with intensity scores
- Recognizes:
  - **Capitalization** (ALL CAPS increases intensity)
  - **Punctuation** (exclamation marks increase intensity)
  - **Emojis** (🎉 = positive, 😞 = negative)
  - **Word relationships** (very good vs. good)

**Returned data:**

```python
{
    'score': 0.75,           # 0-1 range (converted from compound)
    'compound': 0.5,         # VADER's native -1 to 1 range
    'positive': 0.35,        # Proportion of positive words
    'negative': 0.0,         # Proportion of negative words
    'neutral': 0.65          # Proportion of neutral words
}
```

**Example:**

```
Text: "I LOVE this!!! 🎉"
VADER output:
- Recognizes caps: LOVE
- Recognizes punctuation: !!!
- Recognizes emoji: 🎉
- compound = 0.87 (very positive)
- converted score = (0.87 + 1) / 2 = 0.935
```

---

### 4. **sentiment_classification(score: float) -> str**

Converts score (0-1 range) to sentiment label.

```python
def sentiment_classification(score: float) -> str:
    """Classify sentiment based on score (0-1 range)."""
```

**Classification thresholds:**

- **score ≥ 0.65** → "Positive" 😊
- **score ≤ 0.35** → "Negative" 😞
- **0.35 < score < 0.65** → "Neutral" 😐

---

### 5. **analyze_sentiment(text: str, method: str = 'hybrid') -> Dict**

**Main entry point** - orchestrates all three methods.

```python
def analyze_sentiment(text: str, method: str = 'hybrid') -> Dict[str, Any]:
    """
    Analyze sentiment using NLTK, VADER, or hybrid approach.
    """
```

**Parameters:**

- `text`: Input text to analyze
- `method`: 'nltk', 'vader', or 'hybrid' (default)

**Return format:**

```python
{
    'sentiment': 'Positive',      # Classification
    'score': 0.75,                # Confidence (0-1)
    'details': {                  # Method-specific info
        'method': 'Hybrid (NLTK + VADER)',
        'approach': 'Combined rule-based and lexicon-based',
        'nltk_score': 0.66,
        'vader_score': 0.84,
        'best_for': 'General-purpose sentiment analysis'
    }
}
```

---

## Three Analysis Methods

### **1. NLTK Method** 📚

```
Method: analyze_sentiment(text, method='nltk')
```

| Aspect | Details |
|--------|---------|
| **Approach** | Rule-based using custom word lists |
| **Strengths** | ✅ Fast, transparent, controllable |
| **Weaknesses** | ❌ Limited to predefined words, may miss context |
| **Best For** | Formal and technical text, controlled vocabulary |
| **Example** | "I really love this" → 0.82 (Positive) |

---

### **2. VADER Method** 🎵

```
Method: analyze_sentiment(text, method='vader')
```

| Aspect | Details |
|--------|---------|
| **Approach** | Lexicon-based with intensity modifiers |
| **Strengths** | ✅ Recognizes caps, punctuation, emojis |
| **Weaknesses** | ❌ More computational, may over-weight punctuation |
| **Best For** | Social media, informal text, emotional language |
| **Example** | "OMG I LOVE THIS!!! 🎉" → 0.94 (Positive) |

---

### **3. Hybrid Method** 🔀

```
Method: analyze_sentiment(text, method='hybrid')  # Default
```

| Aspect | Details |
|--------|---------|
| **Approach** | Averages NLTK + VADER scores |
| **Strengths** | ✅ Robust, balanced, covers both formal & social |
| **Weaknesses** | ❌ Slower, two operations instead of one |
| **Best For** | General-purpose analysis with good coverage |
| **Example** | Any text → relies on both methods for accuracy |

**Formula:**
```
Hybrid Score = (NLTK Score + VADER Score) / 2
```

---

## How Negation Works

Negation handling is crucial for accurate sentiment analysis.

### Example 1: Simple Negation

```
Text: "This is not good"
         ↓
NLTK processes:
- Lemmatizes to: ["this", "is", "not", "good"]
- Finds "good" (positive word) at position 3
- Checks window [-4:3]: ["this", "is", "not"]
- Finds "not" in window → NEGATED
- Adjusts: score -= 0.16 instead of score += 0.16
         ↓
Result: Negative sentiment
```

### Example 2: Negation Window

```
Text: "I was not really happy about this"
         ↓
Tokens: ["i", "was", "not", "really", "happy", "about", "this"]
- "happy" at position 4
- Window check: positions 0-3 (max 4 before)
- Finds "not" → NEGATED
- Applied: score -= 0.16
         ↓
Result: Negative despite "happy"
```

### Negation Words Detected

- **Direct negation**: not, no, never, can't
- **Contractions**: don't, doesn't, didn't, isn't, wasn't, aren't, weren't
- **Emphatic negation**: hardly, rarely, cannot

---

## Example Usage

### Using the Module Directly

```python
from sentiment.analyzer import analyze_sentiment

# Method 1: NLTK
result1 = analyze_sentiment("I love this product!", method='nltk')
print(result1)
# Output:
# {
#     'sentiment': 'Positive',
#     'score': 0.82,
#     'details': {
#         'method': 'NLTK lemmatization',
#         'approach': 'Rule-based with custom word lists and negation detection',
#         'best_for': 'Formal and technical text'
#     }
# }

# Method 2: VADER
result2 = analyze_sentiment("I love this product!", method='vader')
print(result2['score'])  # 0.78

# Method 3: Hybrid (recommended)
result3 = analyze_sentiment("I love this product!", method='hybrid')
print(result3['score'])  # 0.80 (average of NLTK and VADER)
```

### In FastAPI Endpoint

```python
from fastapi import FastAPI
from sentiment.analyzer import analyze_sentiment

@app.post("/api/sentiment/compare")
async def compare_methods(request: SentimentRequest):
    nltk_result = analyze_sentiment(request.text, method='nltk')
    vader_result = analyze_sentiment(request.text, method='vader')
    hybrid_result = analyze_sentiment(request.text, method='hybrid')
    
    return {
        'text': request.text,
        'nltk': nltk_result,
        'vader': vader_result,
        'hybrid': hybrid_result
    }
```

---

## Score Ranges

All scores are normalized to **0.0 to 1.0**:

| Score | Sentiment | Label |
|-------|-----------|-------|
| 0.00 - 0.35 | Negative | 😞 |
| 0.35 - 0.65 | Neutral | 😐 |
| 0.65 - 1.00 | Positive | 😊 |

---

## Performance Notes

### NLTK vs VADER

| Metric | NLTK | VADER |
|--------|------|-------|
| **Speed** | 🚀 Very Fast | ⚡ Fast |
| **Memory** | 💾 Low | 💾 Low |
| **Best for** | Formal text | Social media |
| **False Positives** | Higher | Lower |
| **Sarcasm** | ❌ Struggles | ⚠️ Better |
| **Emojis** | ❌ Ignored | ✅ Recognized |

---

## Summary

The `analyzer.py` module provides three complementary sentiment analysis approaches:

1. **NLTK**: Fast, rule-based, good for formal text
2. **VADER**: Social-media optimized, recognizes intensity
3. **Hybrid**: Best of both worlds, recommended for general use

All methods handle negation, return scores 0-1, and provide detailed breakdown for transparency.

---

**Created**: April 13, 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✅
