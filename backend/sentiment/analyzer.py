import re
import nltk
from typing import Dict, Any

# NLTK imports and setup
try:
    from nltk.corpus import wordnet
    from nltk.stem import WordNetLemmatizer
    from nltk.tokenize import word_tokenize
    from nltk import pos_tag
    from nltk.sentiment import SentimentIntensityAnalyzer
except ImportError:
    # Download required NLTK data
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('averaged_perceptron_tagger_eng', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
    from nltk.corpus import wordnet
    from nltk.stem import WordNetLemmatizer
    from nltk.tokenize import word_tokenize
    from nltk import pos_tag
    from nltk.sentiment import SentimentIntensityAnalyzer


class NLTKLemmatizer:
    """Wrapper for NLTK-based lemmatization."""
    
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
    
    def get_wordnet_pos(self, treebank_tag: str) -> str:
        """Convert treebank POS tags to WordNet POS tags."""
        if treebank_tag.startswith('J'):
            return wordnet.ADJ
        elif treebank_tag.startswith('V'):
            return wordnet.VERB
        elif treebank_tag.startswith('N'):
            return wordnet.NOUN
        elif treebank_tag.startswith('R'):
            return wordnet.ADV
        else:
            return wordnet.NOUN
    
    def lemmatize(self, word: str, pos: str = wordnet.NOUN) -> str:
        """Lemmatize a word using NLTK WordNetLemmatizer."""
        return self.lemmatizer.lemmatize(word.lower(), pos=pos)
    
    def process_text(self, text: str) -> list:
        """Tokenize and lemmatize text, returning lemmatized tokens."""
        tokens = word_tokenize(text.lower())
        pos_tags = pos_tag(tokens)
        lemmatized = []
        for word, pos in pos_tags:
            wordnet_pos = self.get_wordnet_pos(pos)
            lemmatized.append(self.lemmatizer.lemmatize(word, pos=wordnet_pos))
        return lemmatized


class SentimentAnalyzerConfig:
    """Configuration for sentiment analysis with NLTK and VADER."""
    
    positive_words = [
        'love', 'like', 'great', 'fantastic', 'excellent', 'recommend', 'easy',
        'amazing', 'happy', 'premium', 'flawless', 'good', 'best',
        'awesome', 'wonderful', 'perfect', 'brilliant', 'delightful',
        'enjoyable', 'lovely', 'beautiful', 'impressive', 'outstanding', 'superior',
        'phenomenal', 'superb', 'exceptional', 'splendid'
    ]
    
    negative_words = [
        'disappointed', 'slow', 'bad', 'poor', 'terrible', 'hate',
        'worst', 'frustrating', 'problem', 'unhelpful', 'awful',
        'horrible', 'disgusting', 'annoying', 'broken', 'useless',
        'waste', 'disaster', 'pathetic', 'dreadful', 'mediocre',
        'inadequate', 'unsatisfactory', 'disappointing'
    ]
    
    lemmatizer = NLTKLemmatizer()
    vader_analyzer = SentimentIntensityAnalyzer()


def is_negated(word: str, tokens: list) -> bool:
    """Check if a sentiment word is preceded by negation within a token window."""
    negation_tokens = {
        'not', 'no', 'never', "don't", "doesn't", "didn't", 'hardly',
        'rarely', "can't", 'cannot', "isn't", "wasn't", "aren't", "weren't"
    }
    try:
        word_idx = tokens.index(word)
        window_start = max(0, word_idx - 4)
        window = tokens[window_start:word_idx]
        return any(token in negation_tokens for token in window)
    except ValueError:
        return False


def analyze_with_nltk(text: str) -> float:
    """Analyze sentiment using NLTK lemmatization with negation handling."""
    lemmatized_tokens = SentimentAnalyzerConfig.lemmatizer.process_text(text)
    
    score = 0.5

    for word in SentimentAnalyzerConfig.positive_words:
        lemma = SentimentAnalyzerConfig.lemmatizer.lemmatize(word)
        if lemma in lemmatized_tokens:
            if is_negated(lemma, lemmatized_tokens):
                score -= 0.16
            else:
                score += 0.16

    for word in SentimentAnalyzerConfig.negative_words:
        lemma = SentimentAnalyzerConfig.lemmatizer.lemmatize(word)
        if lemma in lemmatized_tokens:
            if is_negated(lemma, lemmatized_tokens):
                score += 0.16
            else:
                score -= 0.16

    score = max(0.02, min(0.98, score))
    return score


def analyze_with_vader(text: str) -> Dict[str, float]:
    """Analyze sentiment using VADER (Valence Aware Dictionary and sEntiment Reasoner)."""
    scores = SentimentAnalyzerConfig.vader_analyzer.polarity_scores(text)
    
    # Convert VADER's compound score (-1 to 1) to our 0-1 range
    compound = scores['compound']
    score = (compound + 1) / 2  # Maps -1 to 0, 0 to 0.5, 1 to 1
    
    return {
        'score': score,
        'compound': compound,
        'positive': scores['pos'],
        'negative': scores['neg'],
        'neutral': scores['neu']
    }


def sentiment_classification(score: float) -> str:
    """Classify sentiment based on score (0-1 range)."""
    if score >= 0.65:
        return 'Positive'
    elif score <= 0.35:
        return 'Negative'
    else:
        return 'Neutral'


def analyze_sentiment(text: str, method: str = 'hybrid') -> Dict[str, Any]:
    """
    Analyze sentiment using NLTK, VADER, or hybrid approach.
    
    Args:
        text: Input text to analyze
        method: 'nltk', 'vader', or 'hybrid' (default)
    
    Returns:
        Dictionary with sentiment classification, score, and detailed analysis
    """
    if not text.strip():
        return {
            'sentiment': 'Unknown',
            'score': 0.0,
            'details': {'error': 'Empty text provided'}
        }

    if method == 'nltk':
        nltk_score = analyze_with_nltk(text)
        sentiment = sentiment_classification(nltk_score)
        
        return {
            'sentiment': sentiment,
            'score': round(nltk_score, 2),
            'details': {
                'method': 'NLTK lemmatization',
                'approach': 'Rule-based with custom word lists and negation detection',
                'best_for': 'Formal and technical text'
            }
        }
    
    elif method == 'vader':
        vader_data = analyze_with_vader(text)
        sentiment = sentiment_classification(vader_data['score'])
        
        return {
            'sentiment': sentiment,
            'score': round(vader_data['score'], 2),
            'details': {
                'method': 'VADER',
                'approach': 'Lexicon-based with intensity modifiers',
                'best_for': 'Social media and informal text',
                'compound': round(vader_data['compound'], 2),
                'positive': round(vader_data['positive'], 2),
                'negative': round(vader_data['negative'], 2),
                'neutral': round(vader_data['neutral'], 2)
            }
        }
    
    else:  # hybrid (default)
        nltk_score = analyze_with_nltk(text)
        vader_data = analyze_with_vader(text)
        
        # Hybrid: average both approaches
        hybrid_score = (nltk_score + vader_data['score']) / 2
        sentiment = sentiment_classification(hybrid_score)
        
        return {
            'sentiment': sentiment,
            'score': round(hybrid_score, 2),
            'details': {
                'method': 'Hybrid (NLTK + VADER)',
                'approach': 'Combined rule-based and lexicon-based analysis',
                'nltk_score': round(nltk_score, 2),
                'vader_score': round(vader_data['score'], 2),
                'vader_compound': round(vader_data['compound'], 2),
                'best_for': 'General-purpose sentiment analysis with robust coverage'
            }
        }
