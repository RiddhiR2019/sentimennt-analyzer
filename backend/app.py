from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentiment.analyzer import analyze_sentiment

app = FastAPI(
    title="Sentiment Analyzer API",
    description="API for analyzing sentiment in text with NLTK, VADER, or hybrid approaches",
    version="2.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],  # Vite dev server (ports 5173 and 5174)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SentimentRequest(BaseModel):
    text: str
    method: str = Field(
        default="hybrid",
        description="Analysis method: 'nltk' (lemmatization), 'vader' (social media), or 'hybrid' (combined)",
        pattern="^(nltk|vader|hybrid)$"
    )


class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    details: dict


@app.post("/api/sentiment", response_model=SentimentResponse)
async def analyze_text_sentiment(request: SentimentRequest):
    """
    Analyze the sentiment of the provided text.
    
    Methods:
    - **hybrid** (default): Combines NLTK and VADER for robust analysis
    - **nltk**: Rule-based lemmatization with custom word lists (best for formal text)
    - **vader**: Lexicon-based with intensity modifiers (best for social media)

    Returns sentiment classification, confidence score, and analysis details.
    """
    try:
        result = analyze_sentiment(request.text, method=request.method)
        return SentimentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


class MethodComparisonResponse(BaseModel):
    text: str
    nltk: dict
    vader: dict
    hybrid: dict


@app.post("/api/sentiment/compare", response_model=MethodComparisonResponse)
async def compare_sentiment_methods(request: SentimentRequest):
    """
    Compare all three sentiment analysis methods for the same text.
    
    Returns results from NLTK, VADER, and Hybrid approaches side-by-side.
    """
    try:
        nltk_result = analyze_sentiment(request.text, method='nltk')
        vader_result = analyze_sentiment(request.text, method='vader')
        hybrid_result = analyze_sentiment(request.text, method='hybrid')
        
        return MethodComparisonResponse(
            text=request.text,
            nltk={
                'sentiment': nltk_result['sentiment'],
                'score': nltk_result['score']
            },
            vader={
                'sentiment': vader_result['sentiment'],
                'score': vader_result['score'],
                'compound': vader_result['details'].get('compound', 0)
            },
            hybrid={
                'sentiment': hybrid_result['sentiment'],
                'score': hybrid_result['score']
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@app.get("/")
async def root():
    return {"message": "Sentiment Analyzer API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
