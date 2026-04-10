import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeProvider';
import { notificationScheduler } from '../hooks/notificationScheduler';
import './MatchSchedule.css';

const MatchSchedule = () => {
  const { colors } = useTheme();
  const [matches, setMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch upcoming matches
    const mockMatches = [
      {
        id: 1,
        team1: 'Manchester United',
        team2: 'Liverpool',
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        sport: 'Football',
        league: 'Premier League',
        status: 'upcoming',
      },
      {
        id: 2,
        team1: 'Los Angeles Lakers',
        team2: 'Boston Celtics',
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        sport: 'Basketball',
        league: 'NBA',
        status: 'upcoming',
      },
      {
        id: 3,
        team1: 'Real Madrid',
        team2: 'Barcelona',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sport: 'Football',
        league: 'La Liga',
        status: 'upcoming',
      },
      {
        id: 4,
        team1: 'Golden State Warriors',
        team2: 'Miami Heat',
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        sport: 'Basketball',
        league: 'NBA',
        status: 'upcoming',
      },
    ];

    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 500);
  }, []);

  const toggleMatchNotification = (match) => {
    if (scheduledMatches.has(match.id)) {
      // Remove notification
      notificationScheduler.cancelSchedule(`${match.id}-15`);
      const newScheduled = new Set(scheduledMatches);
      newScheduled.delete(match.id);
      setScheduledMatches(newScheduled);
    } else {
      // Schedule notification
      const scheduleId = notificationScheduler.scheduleMatchNotification(match, {
        notificationTime: 15,
        showBrowserNotification: true,
        callback: (m) => {
          console.log('Notification triggered for:', m.team1, 'vs', m.team2);
        },
      });

      if (scheduleId) {
        setScheduledMatches(new Set([...scheduledMatches, match.id]));
      }
    }
  };

  const getMatchTimeDisplay = (startTime) => {
    const matchDate = new Date(startTime);
    const now = new Date();
    const diffMs = matchDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24) {
      return matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else if (diffHours > 0) {
      return `In ${diffHours}h ${diffMins}m`;
    } else if (diffMins > 0) {
      return `In ${diffMins}m`;
    } else {
      return 'Live Now';
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchDate = new Date(match.startTime);
    return matchDate.toDateString() === selectedDate.toDateString();
  });

  const upcomingMatches = matches.filter(match => {
    const matchDate = new Date(match.startTime);
    return matchDate > selectedDate;
  });

  if (loading) {
    return (
      <div className="match-schedule-skeleton">
        <div className="skeleton-item"></div>
        <div className="skeleton-item"></div>
      </div>
    );
  }

  return (
    <div className="match-schedule" style={{ '--primary': colors.primary }}>
      <div className="schedule-header">
        <h3>📅 Match Schedule</h3>
        <p className="subtitle">Get notifications before matches start</p>
      </div>

      <div className="date-selector">
        <button
          className="date-btn prev"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
        >
          ← Yesterday
        </button>

        <div className="date-display">
          <span className="date-text">
            {selectedDate.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          className="date-btn next"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
        >
          Tomorrow →
        </button>
      </div>

      <div className="matches-list">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <div key={match.id} className="match-card" style={{ borderLeftColor: colors.accent }}>
              <div className="match-info">
                <div className="match-teams">
                  <span className="team">{match.team1}</span>
                  <span className="vs">vs</span>
                  <span className="team">{match.team2}</span>
                </div>
                <div className="match-meta">
                  <span className="sport">{match.sport}</span>
                  <span className="league">{match.league}</span>
                  <span className="time" style={{ color: colors.primary }}>
                    {getMatchTimeDisplay(match.startTime)}
                  </span>
                </div>
              </div>

              <button
                className={`notify-btn ${scheduledMatches.has(match.id) ? 'scheduled' : ''}`}
                onClick={() => toggleMatchNotification(match)}
                style={{
                  backgroundColor: scheduledMatches.has(match.id) ? colors.secondary : colors.primary,
                }}
              >
                {scheduledMatches.has(match.id) ? '✓ Notified' : '🔔 Set Reminder'}
              </button>
            </div>
          ))
        ) : (
          <div className="no-matches">
            <p>No matches scheduled for this date</p>
            <small>Check other days or check back later</small>
          </div>
        )}
      </div>

      <div className="upcoming-divider"></div>

      <div className="upcoming-section">
        <h4>🚀 Next Matches</h4>
        <div className="upcoming-list">
          {upcomingMatches.slice(0, 3).map(match => (
            <div
              key={match.id}
              className="upcoming-item"
              style={{ backgroundColor: colors.cardBg }}
            >
              <div className="upcoming-time">
                <span className="time-label">{getMatchTimeDisplay(match.startTime)}</span>
              </div>
              <div className="upcoming-teams">
                <span>{match.team1}</span>
                <span className="vs-short">VS</span>
                <span>{match.team2}</span>
              </div>
              <button
                className={`quick-notify ${scheduledMatches.has(match.id) ? 'active' : ''}`}
                onClick={() => toggleMatchNotification(match)}
              >
                <span>{scheduledMatches.has(match.id) ? '✓' : '🔔'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="schedule-stats">
        <div className="stat">
          <span className="stat-icon">📊</span>
          <div>
            <strong>{matches.length}</strong>
            <small>Total Scheduled</small>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">🔔</span>
          <div>
            <strong>{scheduledMatches.size}</strong>
            <small>Reminders Set</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSchedule;
