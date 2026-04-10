import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeProvider';
import './MatchHighlights.css';

const MatchHighlights = ({ match }) => {
  const { colors } = useTheme();
  const [highlights, setHighlights] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch match highlights
    const mockHighlights = [
      {
        id: 1,
        title: '⚽ Goal by Player A',
        time: '12:34',
        description: 'Spectacular header from a perfect cross',
        type: 'goal',
        thumbnail: '🎯',
      },
      {
        id: 2,
        title: '🟨 Yellow Card',
        time: '18:45',
        description: 'Tackled opponent, reckless challenge',
        type: 'card',
        thumbnail: '⚠️',
      },
      {
        id: 3,
        title: '⚽ Goal by Player B',
        time: '35:22',
        description: 'Tap-in from rebound in the box',
        type: 'goal',
        thumbnail: '🎯',
      },
      {
        id: 4,
        title: '🛡️ Incredible Save',
        time: '42:10',
        description: 'Goalkeeper denies certain goal',
        type: 'save',
        thumbnail: '✋',
      },
    ];

    setTimeout(() => {
      setHighlights(mockHighlights);
      setSelectedHighlight(mockHighlights[0]);
      setLoading(false);
    }, 500);
  }, [match.id]);

  if (loading) {
    return (
      <div className="highlights-skeleton">
        <div className="skeleton-bar" style={{ backgroundColor: colors.accent }}></div>
      </div>
    );
  }

  return (
    <div className="match-highlights" style={{ '--accent-color': colors.accent }}>
      <div className="highlights-header">
        <h3>📺 Match Highlights</h3>
        <span className="highlights-count">{highlights.length} moments</span>
      </div>

      <div className="highlights-main">
        {selectedHighlight && (
          <div className="highlight-display">
            <div className="highlight-thumbnail" style={{ backgroundColor: colors.cardBg }}>
              <span className="thumbnail-icon">{selectedHighlight.thumbnail}</span>
            </div>
            <div className="highlight-info">
              <h4>{selectedHighlight.title}</h4>
              <p className="highlight-time" style={{ color: colors.accent }}>
                {selectedHighlight.time}
              </p>
              <p className="highlight-description">{selectedHighlight.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="highlights-timeline">
        {highlights.map((highlight) => (
          <button
            key={highlight.id}
            className={`timeline-item ${selectedHighlight?.id === highlight.id ? 'active' : ''}`}
            onClick={() => setSelectedHighlight(highlight)}
            style={{
              backgroundColor: selectedHighlight?.id === highlight.id ? colors.primary : colors.cardBg,
              color: selectedHighlight?.id === highlight.id ? '#fff' : colors.textSecondary,
            }}
            title={highlight.title}
          >
            <span className="item-icon">{highlight.thumbnail}</span>
            <span className="item-time">{highlight.time}</span>
          </button>
        ))}
      </div>

      <div className="highlights-stats">
        <div className="stat-box" style={{ borderColor: colors.primary }}>
          <span>⚽ Goals</span>
          <strong>{highlights.filter(h => h.type === 'goal').length}</strong>
        </div>
        <div className="stat-box" style={{ borderColor: colors.accent }}>
          <span>🟨 Cards</span>
          <strong>{highlights.filter(h => h.type === 'card').length}</strong>
        </div>
        <div className="stat-box" style={{ borderColor: colors.secondary }}>
          <span>✋ Saves</span>
          <strong>{highlights.filter(h => h.type === 'save').length}</strong>
        </div>
      </div>
    </div>
  );
};

export default MatchHighlights;
