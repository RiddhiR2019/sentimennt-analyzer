# Sentiment Analyzer

A full-stack sentiment analysis application with React frontend and Python FastAPI backend. Compare three NLP sentiment analysis methods (NLTK, VADER, Hybrid) in real-time with an interactive dashboard.

## Demo

![Sentiment Analyzer Demo](./demo.gif)

*See three sentiment analysis methods compare results side-by-side. Learn how to create this GIF: [GIF Demo Guide](./GIF_DEMO_GUIDE.md)*

## Features

✅ **Three Sentiment Analysis Methods**
- NLTK: Rule-based lemmatization (best for formal text)
- VADER: Lexicon-based with intensity modifiers (best for social media)
- Hybrid: Combined approach for robust analysis (recommended)

✅ **Live Method Comparison** - See all three methods analyze the same text simultaneously

✅ **Negation Handling** - Correctly identifies "not good" as negative sentiment

✅ **Analytics Dashboard** - Track sentiment trends, visualize distributions, monitor confidence scores

✅ **Multi-Page App** - Home (introduction), Analyzer (main analysis), Dashboard (analytics)

## Project Structure

```
Sentiment Analyzer/
├── demo.gif                    # Demo GIF for GitHub (create with ScreenToGif)
├── GIF_DEMO_GUIDE.md          # Guide to create the demo GIF
├── README.md                  # This file
├── package.json               # Frontend dependencies
├── vite.config.js             # Vite configuration
├── index.html                 # Frontend entry point
├── src/                       # React source code
│   ├── App.jsx               # Router-based main app
│   ├── Home.jsx              # Landing page
│   ├── Analyzer.jsx          # Analysis page
│   ├── Dashboard.jsx         # Analytics page
│   ├── MethodComparison.jsx  # Comparison table component
│   └── styles.css            # All styling
├── backend/                   # Python FastAPI backend
│   ├── app.py                # FastAPI endpoints
│   ├── README.md             # Backend documentation
│   ├── ANALYZER_EXPLANATION.md  # Detailed algorithm explanation
│   ├── requirements.txt      # Python dependencies
│   ├── sentiment/            # Sentiment analysis module
│   │   └── analyzer.py       # Core NLP algorithms
│   └── tests/                # Unit & integration tests
└── .env                      # Frontend API configuration
```

## Quick Start (2 minutes)

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --port 8001

# Terminal 2: Frontend (new terminal)
npm install
npm run dev

# Open http://localhost:5174 in your browser
```

**That's it!** The app will load with the backend API connected.

## Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```

   The API will be available at `http://127.0.0.1:8000`

## API Configuration

The frontend automatically connects to the backend when `VITE_API_URL` is set in `.env`.

To use the backend:
- Set `VITE_API_URL=http://127.0.0.1:8000/api/sentiment` in `.env`
- Start both frontend and backend servers

To use the built-in demo (no backend needed):
- Comment out or remove `VITE_API_URL` in `.env`

## API Endpoints

- `POST /api/sentiment` - Analyze text sentiment
- `GET /` - API information
- `GET /health` - Health check

## Testing

Run backend tests:
```bash
cd backend
pytest
```

## Development

- Frontend: React + Vite
- Backend: FastAPI + Python
- Sentiment analysis: Rule-based (easily replaceable with ML models)

