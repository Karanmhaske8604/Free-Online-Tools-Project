import React, { useState, useEffect } from 'react';
import { FileText, Clock, BarChart3 } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('Welcome to OptiSuite! Paste your text here to analyze word count, sentence structures, paragraph metrics, and keyword density details in real-time. This tool is built entirely client-side, keeping your data private.');
  const [stats, setStats] = useState({
    charsWithSpaces: 0,
    charsNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readTime: 0,
  });
  const [topKeywords, setTopKeywords] = useState([]);

  const analyzeText = () => {
    if (!text) {
      setStats({
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readTime: 0,
      });
      setTopKeywords([]);
      return;
    }

    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Split words
    const wordsArray = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);

    const words = wordsArray.length;

    // Split sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Split paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time (average 200 WPM)
    const readTime = Math.ceil(words / 200);

    setStats({
      charsWithSpaces,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readTime,
    });

    // Keyword density
    const stopWords = new Set([
      'the', 'a', 'to', 'and', 'of', 'in', 'is', 'it', 'you', 'that',
      'this', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'be', 'this',
      'are', 'from', 'your', 'or', 'was', 'were', 'have', 'has', 'had',
    ]);

    const wordCounts = {};
    wordsArray.forEach((word) => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    const sortedKeywords = Object.keys(wordCounts)
      .map((word) => ({
        word,
        count: wordCounts[word],
        density: ((wordCounts[word] / words) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 keywords

    setTopKeywords(sortedKeywords);
  };

  useEffect(() => {
    analyzeText();
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel text-input-panel">
        <div className="json-title-row">
          <h3>Text Analyzer</h3>
          <button onClick={handleClear} className="btn-text">Clear</button>
        </div>
        <textarea
          className="glass-textarea text-counter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to analyze..."
        />
      </div>

      <div className="tool-results glass-panel text-results-panel">
        <h3>Statistics</h3>

        <div className="metrics-row">
          <div className="metric-block">
            <div className="metric-title">Words</div>
            <div className="metric-value">{stats.words}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Characters</div>
            <div className="metric-value">{stats.charsWithSpaces}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Sentences</div>
            <div className="metric-value">{stats.sentences}</div>
          </div>
        </div>

        <div className="metrics-row secondary-stats-row">
          <div className="metric-block">
            <div className="metric-title">No Spaces</div>
            <div className="metric-value">{stats.charsNoSpaces}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Paragraphs</div>
            <div className="metric-value">{stats.paragraphs}</div>
          </div>
          <div className="metric-block">
            <div className="metric-title">Reading Time</div>
            <div className="metric-value read-time-value">
              <Clock size={16} className="inline-icon" />
              <span>{stats.readTime} min</span>
            </div>
          </div>
        </div>

        <div className="keyword-density-section">
          <div className="section-header-title">
            <BarChart3 size={16} className="section-icon" />
            <h4>Top Keyword Density</h4>
          </div>

          <div className="keywords-list">
            {topKeywords.map((kw, idx) => (
              <div key={idx} className="keyword-row">
                <span className="kw-name">{kw.word}</span>
                <div className="kw-bar-bg">
                  <div className="kw-bar-fill" style={{ width: `${Math.min(kw.density * 10, 100)}%` }}></div>
                </div>
                <span className="kw-density-pct">{kw.count} ({kw.density}%)</span>
              </div>
            ))}

            {topKeywords.length === 0 && (
              <div className="empty-keywords-box">
                <p>Enter more text to extract keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .text-input-panel {
          height: 480px;
          display: flex;
          flex-direction: column;
        }
        .text-counter-textarea {
          flex: 1;
          resize: none;
          line-height: 1.5;
        }
        .text-results-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .secondary-stats-row .metric-value {
          font-size: 1.1rem;
        }
        .read-time-value {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          color: var(--primary) !important;
        }
        .inline-icon {
          color: var(--primary);
        }
        .keyword-density-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
        }
        .section-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }
        .section-header-title h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .section-icon {
          color: var(--primary);
        }
        .keywords-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .keyword-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
        }
        .kw-name {
          width: 80px;
          font-weight: 600;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .kw-bar-bg {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
          overflow: hidden;
        }
        .kw-bar-fill {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: 3px;
        }
        .kw-density-pct {
          width: 70px;
          text-align: right;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .empty-keywords-box {
          text-align: center;
          padding: 1rem;
          color: var(--text-muted);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
