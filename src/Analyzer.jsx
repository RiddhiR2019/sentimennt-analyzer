import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MethodComparison from './MethodComparison';

const apiUrl = import.meta.env.VITE_API_URL;

const sampleDataset = [
  {
    id: 'product-feedback',
    label: 'Product feedback',
    text: 'I love this product, it works flawlessly and feels premium.',
  },
  {
    id: 'service-complaint',
    label: 'Service complaint',
    text: 'I am disappointed with the slow service and unhelpful support.',
  },
  {
    id: 'mixed-review',
    label: 'Balanced review',
    text: 'The design is attractive but the performance could be better.',
  },
  {
    id: 'great-experience',
    label: 'Great experience',
    text: 'Fantastic experience overall; I would recommend it to everyone.',
  },
  {
    id: 'social-media',
    label: 'Social media post',
    text: 'OMG I LOVE THIS!!! Best purchase ever!!! 😍🎉',
  },
];

const simpleStem = (word) => {
  const w = word.toLowerCase();
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('es') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
  return w;
};

const mockCompareText = (inputText) => {
  const positiveWords = ['love', 'like', 'great', 'fantastic', 'excellent', 'recommend', 'easy', 'amazing', 'happy', 'premium', 'flawless'];
  const negativeWords = ['disappointed', 'slow', 'bad', 'poor', 'terrible', 'hate', 'worst', 'frustrating', 'problem', 'unhelpful'];
  const negationWords = ['not', 'no', 'never', "don't", "doesn't", "didn't", 'hardly', 'rarely', "can't", 'cannot', "isn't", "wasn't", "aren't", "weren't"];

  const normalizedText = inputText.toLowerCase();
  const tokens = normalizedText.match(/\b[\w']+\b/g) || [];
  const stemmedTokens = tokens.map(simpleStem);
  let score = 0.5;

  const isNegated = (word) => {
    const stemmedWord = simpleStem(word);
    return stemmedTokens.some((token, index) => {
      if (token !== stemmedWord) return false;
      const windowStart = Math.max(0, index - 4);
      const windowEnd = Math.min(stemmedTokens.length, index + 5);
      const windowTokens = stemmedTokens.slice(windowStart, windowEnd);
      return windowTokens.some((t) => negationWords.includes(t));
    });
  };

  positiveWords.forEach((word) => {
    const stemmedWord = simpleStem(word);
    if (stemmedTokens.includes(stemmedWord)) {
      score += isNegated(word) ? -0.16 : 0.16;
    }
  });

  negativeWords.forEach((word) => {
    const stemmedWord = simpleStem(word);
    if (stemmedTokens.includes(stemmedWord)) {
      score += isNegated(word) ? 0.16 : -0.16;
    }
  });

  score = Math.min(0.98, Math.max(0.02, score));
  const sentiment = score >= 0.65 ? 'Positive' : score <= 0.35 ? 'Negative' : 'Neutral';

  return {
    text: inputText,
    nltk: {
      sentiment: sentiment,
      score: Number(score.toFixed(2))
    },
    vader: {
      sentiment: sentiment,
      score: Number(score.toFixed(2)),
      compound: Number((score * 2 - 1).toFixed(2))
    },
    hybrid: {
      sentiment: sentiment,
      score: Number(score.toFixed(2))
    }
  };
};

export default function Analyzer({ analytics, onAnalysis }) {
  const [text, setText] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSentiment = async () => {
    setLoading(true);
    setError('');
    setComparison(null);

    if (!text.trim()) {
      setError('Please enter text to analyze.');
      setLoading(false);
      return;
    }

    const useLocalMock = !apiUrl;

    try {
      const data = useLocalMock
        ? mockCompareText(text)
        : await fetch(`${apiUrl.replace('/api/sentiment', '')}/api/sentiment/compare`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error('Failed to analyze sentiment.');
            }
            return response.json();
          });

      setComparison(data);
      
      // Track history
      if (onAnalysis) {
        onAnalysis({
          sentiment: data.hybrid.sentiment,
          score: data.hybrid.score,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the sentiment API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Sentiment Analyzer</h1>
            <p>Compare sentiment across NLTK, VADER, and Hybrid methods.</p>
          </div>
          <Link to="/dashboard" className="nav-link">View Dashboard →</Link>
        </div>
      </header>

      <main>
        <section className="sample-panel">
          <div className="sample-heading">
            <div>
              <h2>Sample dataset</h2>
              <p>Use predefined texts to see how different methods compare.</p>
            </div>
          </div>

          <div className="sample-grid">
            {sampleDataset.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="sample-card"
                onClick={() => setText(sample.text)}
              >
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </section>

        <textarea
          placeholder="Type text here..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button type="button" onClick={analyzeSentiment} disabled={loading}>
          {loading ? 'Analyzing...' : 'Compare Methods'}
        </button>

        {error && <div className="message error">{error}</div>}

        {!apiUrl && (
          <div className="message info">
            Backend not configured. Using built-in sample dataset for demo sentiment analysis.
          </div>
        )}

        {comparison && <MethodComparison comparison={comparison} />}

        {analytics.total > 0 && (
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-inline">
              <span>Total analyses: <strong>{analytics.total}</strong></span>
              <span>Positive: <strong>{analytics.positive}</strong></span>
              <span>Neutral: <strong>{analytics.neutral}</strong></span>
              <span>Negative: <strong>{analytics.negative}</strong></span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
