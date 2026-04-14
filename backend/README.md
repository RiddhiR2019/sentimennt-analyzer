# Sentiment Analyzer Backend

A FastAPI-based sentiment analysis API with support for three different NLP methods: NLTK (rule-based), VADER (lexicon-based), and Hybrid (combined approach).

**Version:** 2.0.0  
**Status:** Production Ready ✅

---

## Features

✅ **Three Sentiment Analysis Methods**
- **NLTK**: Rule-based lemmatization with POS tagging (best for formal text)
- **VADER**: Lexicon-based with intensity modifiers for social media (best for emojis, caps, punctuation)
- **Hybrid**: Combines both methods for robust general-purpose analysis

✅ **Negation Handling** - Detects "not good" as negative  
✅ **Method Comparison** - Compare all three methods side-by-side  
✅ **Standardized Scoring** - All methods return 0-1 normalized scores  
✅ **CORS Enabled** - Works with frontend on ports 5173 & 5174  

---

## Setup & Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Required packages:
- FastAPI 0.135.3+
- Uvicorn 0.38.0+
- NLTK 3.8+
- Python 3.8+

### 2. Start the Server

```bash
# Development mode with auto-reload
python -m uvicorn app:app --reload

# Production mode on specific port
python -m uvicorn app:app --host 127.0.0.1 --port 8001
```

**API Base URL:** `http://127.0.0.1:8000` (development) or `http://127.0.0.1:8001` (production)

---

## API Endpoints

### Root & Health

**GET /** - API information
```bash
curl http://localhost:8001/
```

**GET /health** - Health check status
```bash
curl http://localhost:8001/health
```

---

### Single Sentiment Analysis

**POST /api/sentiment** - Analyze text with specified method

**Request:**
```json
{
  "text": "I love this product! It works flawlessly.",
  "method": "hybrid"
}
```

**Response:**
```json
{
  "sentiment": "Positive",
  "score": 0.82,
  "details": {
    "method": "Hybrid (NLTK + VADER)",
    "approach": "Combined rule-based and lexicon-based analysis",
    "nltk_score": 0.66,
    "vader_score": 0.98,
    "best_for": "General-purpose sentiment analysis with robust coverage"
  }
}
```

**Method Parameter Options:**
- `nltk` - Rule-based lemmatization (fast, transparent)
- `vader` - Lexicon-based (social media optimized)
- `hybrid` - Both methods averaged (default, recommended)

---

### Compare All Methods

**POST /api/sentiment/compare** - Get results from all three methods at once

**Request:**
```json
{
  "text": "I love this product!",
  "method": "hybrid"
}
```

**Response:**
```json
{
  "text": "I love this product!",
  "nltk": {
    "sentiment": "Positive",
    "score": 0.82
  },
  "vader": {
    "sentiment": "Positive",
    "score": 0.84,
    "compound": 0.68
  },
  "hybrid": {
    "sentiment": "Positive",
    "score": 0.83
  }
}
```

This endpoint is perfect for understanding why different methods might give slightly different scores.

---

## Sentiment Classification

All scores are normalized to **0.0 - 1.0** range:

| Score Range | Classification | Emoji |
|-------------|-----------------|-------|
| 0.00 - 0.35 | Negative | 😞 |
| 0.35 - 0.65 | Neutral | 😐 |
| 0.65 - 1.00 | Positive | 😊 |

---

## Method Comparison

### NLTK (Rule-Based)

```
Approach: Custom word lists + lemmatization + negation detection
Speed: 🚀 Very fast
Best for: Formal text, technical documentation
Limitations: Limited to predefined words
```

**Example:**
- Input: "I love this"
- Output: score 0.82 (Positive)

### VADER (Lexicon-Based)

```
Approach: Pre-trained sentiment lexicon with intensity modifiers
Speed: ⚡ Fast
Best for: Social media, informal text, emojis
Strengths: Recognizes caps (LOVE), punctuation (!!!), emojis (🎉)
```

**Example:**
- Input: "OMG I LOVE THIS!!! 🎉"
- Output: score 0.94 (Positive) - recognizes intensity

### Hybrid (Combined)

```
Approach: (NLTK score + VADER score) / 2
Speed: Standard
Best for: General-purpose analysis, production use
Benefits: Robust, balanced, covers formal & social text
```

**Example:**
- NLTK: 0.82
- VADER: 0.94
- Hybrid: 0.88 (average)

---

## Code Documentation

For detailed explanation of the sentiment analysis algorithms and implementation, see [ANALYZER_EXPLANATION.md](./ANALYZER_EXPLANATION.md):

- How lemmatization works
- POS tagging for accuracy
- Negation window detection
- VADER intensity modifiers
- Complete code walkthroughs

---

## Testing

### Run All Tests

```bash
pytest
```

### Test Specific File

```bash
pytest tests/test_analyzer.py -v
pytest tests/test_api.py -v
```

### Expected Results

- ✅ 10/10 Analyzer unit tests passing
- ✅ 5/5 API integration tests passing

---

## CORS Configuration

The backend is configured to allow requests from:

- `http://localhost:5173` (Vite dev port 1)
- `http://127.0.0.1:5173` (Vite dev port 1)
- `http://localhost:5174` (Vite dev port 2)
- `http://127.0.0.1:5174` (Vite dev port 2)

To allow additional origins, update the `allow_origins` list in `app.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Project Structure

```
backend/
├── app.py                           # FastAPI app and endpoints
├── requirements.txt                 # Python dependencies
├── README.md                        # This file
├── ANALYZER_EXPLANATION.md          # Detailed code documentation
├── tests/
│   ├── test_analyzer.py            # Unit tests for sentiment analysis
│   └── test_api.py                 # Integration tests for API
└── sentiment/
    ├── __init__.py
    └── analyzer.py                 # Core sentiment analysis logic
```

---

## Future Improvements

- 📊 Add TextBlob and Transformers methods
- 🌍 Multi-language support
- 😊 Emotion detection (joy, anger, fear, etc.)
- 🎯 Aspect-based sentiment analysis
- 💾 Database integration for history
- 🔐 Authentication & rate limiting
- 📈 Trend analysis and reporting

---

## Environment Variables

Currently no environment variables required. The app uses default settings:

- Host: `127.0.0.1`
- Port: `8000` (dev), `8001` (custom)
- CORS: Configured for Vite dev ports

---

## Troubleshooting

### NLTK Data Missing

If you get errors about missing NLTK data:

```bash
python -c "import nltk; nltk.download('wordnet'); nltk.download('punkt'); nltk.download('averaged_perceptron_tagger_eng'); nltk.download('vader_lexicon')"
```

### Port Already in Use

Change the port:

```bash
python -m uvicorn app:app --port 8002
```

### CORS Errors

Check that your frontend is on an allowed origin. Update `app.py` if needed.

---

## License

Part of the Sentiment Analyzer project  
**Created:** April 2026  
**Version:** 2.0.0
