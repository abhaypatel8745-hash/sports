import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeProvider';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';
import './LiveMatchTracker.css';

const LiveMatchTracker = ({ match }) => {
  const { colors } = useTheme();
  const { isConnected, liveData } = useRealTimeUpdates();
  const [matchState, setMatchState] = useState(match);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    possession: { team1: 55, team2: 45 },
    shots: { team1: 8, team2: 5 },
    shotsOnTarget: { team1: 4, team2: 2 },
    passes: { team1: 450, team2: 420 },
    fouls: { team1: 6, team2: 8 },
  });

  useEffect(() => {
    // Simulate live match updates
    const interval = setInterval(() => {
      setMatchState(prev => {
        if (prev.status !== 'live') return prev;

        const isRandomEvent = Math.random() > 0.85;

        if (isRandomEvent) {
          const events_data = [
            {
              type: 'goal',
              team: Math.random() > 0.5 ? prev.team1 : prev.team2,
              minute: Math.floor(Math.random() * 45) + 1,
              player: 'Player ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
            },
            {
              type: 'card',
              card: Math.random() > 0.7 ? 'red' : 'yellow',
              team: Math.random() > 0.5 ? prev.team1 : prev.team2,
              minute: Math.floor(Math.random() * 45) + 1,
              player: 'Player ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
            },
            {
              type: 'substitution',
              team: Math.random() > 0.5 ? prev.team1 : prev.team2,
              minute: Math.floor(Math.random() * 45) + 1,
              playerIn: 'Sub Player',
              playerOut: 'Original Player',
            },
          ];

          const newEvent = events_data[Math.floor(Math.random() * events_data.length)];
          setEvents(prev => [newEvent, ...prev]);

          if (newEvent.type === 'goal') {
            if (newEvent.team === prev.team1) {
              return { ...prev, score1: prev.score1 + 1 };
            } else {
              return { ...prev, score2: prev.score2 + 1 };
            }
          }
        }

        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (event) => {
    switch (event.type) {
      case 'goal':
        return '⚽';
      case 'card':
        return event.card === 'red' ? '🔴' : '🟨';
      case 'substitution':
        return '🔄';
      default:
        return '📍';
    }
  };

  const getEventDescription = (event) => {
    if (event.type === 'goal') {
      return `${event.player} scores! (${event.minute}')`;
    } else if (event.type === 'card') {
      return `${event.player} - ${event.card === 'red' ? 'Red' : 'Yellow'} Card (${event.minute}')`;
    } else if (event.type === 'substitution') {
      return `${event.playerOut} → ${event.playerIn} (${event.minute}')`;
    }
    return '';
  };

  return (
    <div className="live-match-tracker" style={{ '--primary': colors.primary }}>
      {/* Connection Status */}
      <div className="connection-status">
        <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span className="status-text">
          {isConnected ? '🟢 Live Connection' : '🔴 Offline - Polling Mode'}
        </span>
      </div>

      {/* Match Header */}
      <div className="match-header" style={{ backgroundImage: colors.gradient }}>
        <div className="team team1">
          <span className="team-name">{matchState.team1}</span>
          <span className="score">{matchState.score1 || 0}</span>
        </div>

        <div className="match-status">
          <div className="live-badge">
            <span className="pulse"></span>
            <span>LIVE</span>
          </div>
          <span className="time-elapsed">45:32</span>
        </div>

        <div className="team team2">
          <span className="score">{matchState.score2 || 0}</span>
          <span className="team-name">{matchState.team2}</span>
        </div>
      </div>

      {/* Small Scoreboard with possessions */}
      <div className="small-scoreboard">
        <div className="stat-group">
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{
                width: `${stats.possession.team1}%`,
                backgroundColor: colors.primary,
              }}
            ></div>
          </div>
          <div className="stat-labels">
            <span className="stat-value">{stats.possession.team1}%</span>
            <span className="stat-name">Possession</span>
            <span className="stat-value">{stats.possession.team2}%</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="mini-stat">
            <span className="stat-icon">📸</span>
            <div>
              <strong>{stats.shots.team1}</strong>
              <small>Shots</small>
            </div>
          </div>
          <div className="mini-stat">
            <span className="stat-icon">🎯</span>
            <div>
              <strong>{stats.shotsOnTarget.team1}</strong>
              <small>On Target</small>
            </div>
          </div>
          <div className="mini-stat">
            <span className="stat-icon">🧭</span>
            <div>
              <strong>{stats.passes.team1}</strong>
              <small>Passes</small>
            </div>
          </div>
          <div className="mini-stat">
            <span className="stat-icon">⚠️</span>
            <div>
              <strong>{stats.fouls.team1}</strong>
              <small>Fouls</small>
            </div>
          </div>
        </div>
      </div>

      {/* Match Events Timeline */}
      <div className="events-timeline">
        <h4 className="timeline-title">⏱️ Match Events</h4>
        <div className="events-list">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className={`event-item ${event.type}`}
                style={{
                  borderLeftColor:
                    event.team === matchState.team1 ? colors.primary : colors.secondary,
                }}
              >
                <span className="event-icon">{getEventIcon(event)}</span>
                <div className="event-content">
                  <div className="event-team">{event.team}</div>
                  <div className="event-description">{getEventDescription(event)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">Match just started...</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn" style={{ backgroundColor: colors.primary }}>
          📊 Full Stats
        </button>
        <button className="action-btn" style={{ backgroundColor: colors.secondary }}>
          📺 Watch Live
        </button>
        <button className="action-btn" style={{ backgroundColor: colors.accent }}>
          💬 Comments
        </button>
      </div>
    </div>
  );
};

export default LiveMatchTracker;
