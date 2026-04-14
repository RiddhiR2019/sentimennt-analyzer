import { Link } from 'react-router-dom';
import './styles.css';

export default function Home() {
  return (
    <div className="app-shell">
      <header>
        <h1>Sentiment Analyzer</h1>
        <p>Advanced multi-method sentiment analysis with NLTK, VADER, and Hybrid approaches</p>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Unlock Sentiment Insights</h2>
            <p>
              Our sentiment analyzer uses three powerful methods to understand the emotional tone of your text:
            </p>
            <ul className="feature-list">
              <li><strong>NLTK Lemmatization:</strong> Rule-based analysis perfect for formal and technical text</li>
              <li><strong>VADER:</strong> Lexicon-based approach ideal for social media and informal language</li>
              <li><strong>Hybrid:</strong> Combined approach for balanced, comprehensive sentiment analysis</li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <h3>Start Analyzing</h3>
            <p>Compare sentiment results across all three methods and see how they differ.</p>
            <Link to="/analyze" className="cta-button primary">
              Go to Analyzer
            </Link>
          </div>

          <div className="cta-card">
            <h3>View Analytics</h3>
            <p>Track your sentiment analysis history and explore detailed metrics.</p>
            <Link to="/dashboard" className="cta-button secondary">
              Go to Dashboard
            </Link>
          </div>
        </section>

        <section className="methods-section">
          <h2>Comparison Methods</h2>
          <div className="methods-grid">
            <div className="method-card">
              <h4>NLTK</h4>
              <div className="method-badge">Linguistic</div>
              <p className="method-description">Uses WordNet lemmatization with POS tagging</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Best for:</span>
                  <span className="value">Formal text</span>
                </div>
                <div className="detail-item">
                  <span className="label">Handles:</span>
                  <span className="value">Negation, tenses</span>
                </div>
              </div>
            </div>

            <div className="method-card">
              <h4>VADER</h4>
              <div className="method-badge">Social</div>
              <p className="method-description">Lexicon-based with intensity modifiers</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Best for:</span>
                  <span className="value">Social media</span>
                </div>
                <div className="detail-item">
                  <span className="label">Recognizes:</span>
                  <span className="value">Caps, punctuation, emojis</span>
                </div>
              </div>
            </div>

            <div className="method-card">
              <h4>Hybrid</h4>
              <div className="method-badge">Combined</div>
              <p className="method-description">Averages NLTK and VADER scores</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Best for:</span>
                  <span className="value">General use</span>
                </div>
                <div className="detail-item">
                  <span className="label">Uses:</span>
                  <span className="value">Both methods</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
