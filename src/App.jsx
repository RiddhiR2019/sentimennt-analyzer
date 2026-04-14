import { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Analyzer from './Analyzer';
import Dashboard from './Dashboard';
import './styles.css';

function App() {
  const [history, setHistory] = useState([]);

  const analytics = useMemo(() => {
    const totals = history.reduce(
      (acc, item) => {
        const sentiment = (item.sentiment || 'Unknown').toLowerCase();
        acc.total += 1;

        if (sentiment === 'positive') acc.positive += 1;
        else if (sentiment === 'negative') acc.negative += 1;
        else acc.neutral += 1;

        if (typeof item.score === 'number') {
          acc.scoreSum += item.score;
          acc.scoreCount += 1;
        }

        return acc;
      },
      { total: 0, positive: 0, neutral: 0, negative: 0, scoreSum: 0, scoreCount: 0 }
    );

    return {
      total: totals.total,
      positive: totals.positive,
      neutral: totals.neutral,
      negative: totals.negative,
      averageScore:
        totals.scoreCount > 0 ? (totals.scoreSum / totals.scoreCount).toFixed(2) : null,
    };
  }, [history]);

  const handleAnalysis = (analysisResult) => {
    setHistory((current) => [analysisResult, ...current]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/analyze"
          element={<Analyzer analytics={analytics} onAnalysis={handleAnalysis} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard analytics={analytics} history={history} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
