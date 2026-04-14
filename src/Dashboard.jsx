import { Link } from 'react-router-dom';

const PieChart = ({ segments, size = 180 }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let cumulative = 0;

  return (
    <svg className="chart-svg" viewBox="0 0 180 180" width={size} height={size}>
      <circle cx="90" cy="90" r={radius} fill="#f8fafc" />
      {segments.map((segment) => {
        const portion = segment.value / total;
        const dashArray = portion * circumference;
        const dashOffset = circumference * (1 - cumulative) - dashArray;
        cumulative += portion;

        return (
          <circle
            key={segment.label}
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={segment.color}
            strokeWidth="18"
            strokeDasharray={`${dashArray} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.35s ease, stroke-dashoffset 0.35s ease' }}
            transform="rotate(-90 90 90)"
          />
        );
      })}
      <text x="90" y="92" textAnchor="middle" fontSize="18" fill="#0f172a" fontWeight="700">
        {total}
      </text>
    </svg>
  );
};

const BarChart = ({ entries }) => {
  return (
    <div className="bar-chart">
      {entries.length === 0 ? (
        <div className="message info">Run some analyses to populate the confidence chart.</div>
      ) : (
        entries.map((entry, index) => (
          <div key={`${entry.timestamp}-${index}`} className="bar-row">
            <div>
              <div className="bar-label">{entry.sentiment}</div>
              <div className="bar-meta">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className="bar-track" title={`Confidence: ${entry.score}`}>
              <div className="bar-fill" style={{ width: `${Math.round(entry.score * 100)}%`, backgroundColor: entry.sentiment === 'Positive' ? '#16a34a' : entry.sentiment === 'Negative' ? '#dc2626' : '#64748b' }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default function Dashboard({ analytics, history }) {
  return (
    <div className="app-shell">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Summary of your sentiment analysis history.</p>
          </div>
          <Link to="/analyze" className="nav-link">← Back to Analyzer</Link>
        </div>
      </header>

      <main>
        <section className="dashboard-panel">
          <div className="dashboard-grid">
            <div className="metric-card">
              <span>Total analyses</span>
              <strong>{analytics.total}</strong>
            </div>
            <div className="metric-card">
              <span>Positive</span>
              <strong>{analytics.positive}</strong>
            </div>
            <div className="metric-card">
              <span>Neutral</span>
              <strong>{analytics.neutral}</strong>
            </div>
            <div className="metric-card">
              <span>Negative</span>
              <strong>{analytics.negative}</strong>
            </div>
            <div className="metric-card wide">
              <span>Average confidence</span>
              <strong>{analytics.averageScore ?? '—'}</strong>
            </div>
          </div>

          <div className="dashboard-visuals">
            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3>Sentiment distribution</h3>
                  <p>Interactive view of positive, neutral, and negative results.</p>
                </div>
              </div>
              <PieChart
                segments={[
                  { label: 'Positive', value: analytics.positive, color: '#22c55e' },
                  { label: 'Neutral', value: analytics.neutral, color: '#64748b' },
                  { label: 'Negative', value: analytics.negative, color: '#ef4444' },
                ]}
              />
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-swatch positive" />
                  Positive: {analytics.positive}
                </div>
                <div className="legend-item">
                  <span className="legend-swatch neutral" />
                  Neutral: {analytics.neutral}
                </div>
                <div className="legend-item">
                  <span className="legend-swatch negative" />
                  Negative: {analytics.negative}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <div>
                  <h3>Recent confidence trend</h3>
                  <p>Bar chart for the latest sentiment scores.</p>
                </div>
              </div>
              <BarChart entries={history.slice(0, 5)} />
            </div>
          </div>

          {history.length === 0 && (
            <div className="message info">
              Run your first analysis to populate the dashboard metrics.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
