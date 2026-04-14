export default function MethodComparison({ comparison }) {
  if (!comparison) return null;

  const getColorClass = (sentiment) => {
    if (sentiment === 'Positive') return 'positive';
    if (sentiment === 'Negative') return 'negative';
    return 'neutral';
  };

  return (
    <div className="comparison-card">
      <h2>Method Comparison</h2>
      <div className="comparison-text">
        <p><strong>Input:</strong> {comparison.text}</p>
      </div>

      <div className="comparison-table">
        <div className="comparison-row header">
          <div className="comparison-col">Method</div>
          <div className="comparison-col">Sentiment</div>
          <div className="comparison-col">Score</div>
          <div className="comparison-col">Details</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-col">
            <span className="method-name">NLTK</span>
            <span className="method-desc">Lemmatization</span>
          </div>
          <div className="comparison-col">
            <span className={`sentiment-badge ${getColorClass(comparison.nltk.sentiment)}`}>
              {comparison.nltk.sentiment}
            </span>
          </div>
          <div className="comparison-col">
            <span className="score">{comparison.nltk.score}</span>
          </div>
          <div className="comparison-col">
            <span className="method-info">Rule-based, handles negation</span>
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-col">
            <span className="method-name">VADER</span>
            <span className="method-desc">Lexicon-based</span>
          </div>
          <div className="comparison-col">
            <span className={`sentiment-badge ${getColorClass(comparison.vader.sentiment)}`}>
              {comparison.vader.sentiment}
            </span>
          </div>
          <div className="comparison-col">
            <span className="score">{comparison.vader.score}</span>
          </div>
          <div className="comparison-col">
            <span className="method-info">Compound: {comparison.vader.compound}</span>
          </div>
        </div>

        <div className="comparison-row highlight">
          <div className="comparison-col">
            <span className="method-name">Hybrid</span>
            <span className="method-desc">Combined</span>
          </div>
          <div className="comparison-col">
            <span className={`sentiment-badge ${getColorClass(comparison.hybrid.sentiment)}`}>
              {comparison.hybrid.sentiment}
            </span>
          </div>
          <div className="comparison-col">
            <span className="score">{comparison.hybrid.score}</span>
          </div>
          <div className="comparison-col">
            <span className="method-info">Average of both methods</span>
          </div>
        </div>
      </div>

      <div className="comparison-summary">
        <div className="summary-item">
          <strong>Recommendation:</strong>
          <p>The Hybrid approach provides balanced results by combining linguistic analysis (NLTK) with social media awareness (VADER).</p>
        </div>
      </div>
    </div>
  );
}
