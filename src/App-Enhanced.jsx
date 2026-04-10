import React from 'react';
import { ThemeProvider } from './context/ThemeProvider';
import { AppContextProvider } from './context/AppContext-Enhanced';

// Components
import Header from './components/Header';
import MatchSchedule from './components/MatchSchedule';
import LiveMatchTracker from './components/LiveMatchTracker';
import MatchHighlights from './components/MatchHighlights';
import Notifications from './components/Notifications';
import LiveScores from './components/LiveScores';
import NewsFeed from './components/NewsFeed';
import PlayerStats from './components/PlayerStats';
import StandingsTable from './components/StandingsTable';
import SearchBar from './components/SearchBar';

import './styles/globals.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedMatch, setSelectedMatch] = React.useState(null);

  const mockMatch = {
    id: 1,
    team1: 'Manchester United',
    team2: 'Liverpool',
    score1: 2,
    score2: 1,
    startTime: new Date().toISOString(),
    status: 'live',
  };

  return (
    <ThemeProvider>
      <AppContextProvider>
        <div className="app">
          {/* Header with theme toggle */}
          <Header onThemeToggle={() => {}} />

          {/* Global Search */}
          <SearchBar />

          {/* Notifications */}
          <Notifications />

          {/* Main Content */}
          <main className="main-content">
            <div className="container">
              {/* Tab Navigation */}
              <nav className="nav-tabs">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button
                  className={`tab ${activeTab === 'live' ? 'active' : ''}`}
                  onClick={() => setActiveTab('live')}
                >
                  🔴 Live Matches
                </button>
                <button
                  className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schedule')}
                >
                  📅 Schedule
                </button>
                <button
                  className={`tab ${activeTab === 'news' ? 'active' : ''}`}
                  onClick={() => setActiveTab('news')}
                >
                  📰 News
                </button>
                <button
                  className={`tab ${activeTab === 'players' ? 'active' : ''}`}
                  onClick={() => setActiveTab('players')}
                >
                  👥 Players
                </button>
                <button
                  className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('standings')}
                >
                  🏆 Standings
                </button>
              </nav>

              {/* Content Sections */}
              <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="overview-grid">
                    <section className="overview-section live-section">
                      <h2>🔴 Live Now</h2>
                      <LiveScores />
                    </section>

                    <section className="overview-section upcoming-section">
                      <h2>📅 Upcoming Matches</h2>
                      <MatchSchedule />
                    </section>
                  </div>
                )}

                {/* Live Matches Tab */}
                {activeTab === 'live' && (
                  <section className="section-live">
                    <h2>🔴 Live Match Tracking</h2>
                    <div className="match-tracker-container">
                      <LiveMatchTracker match={mockMatch} />
                      <MatchHighlights match={mockMatch} />
                    </div>
                  </section>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <section className="section-schedule">
                    <h2>📅 Match Schedule & Notifications</h2>
                    <MatchSchedule />
                  </section>
                )}

                {/* News Tab */}
                {activeTab === 'news' && (
                  <section className="section-news">
                    <h2>📰 News Feed</h2>
                    <NewsFeed />
                  </section>
                )}

                {/* Players Tab */}
                {activeTab === 'players' && (
                  <section className="section-players">
                    <h2>👥 Player Statistics</h2>
                    <PlayerStats />
                  </section>
                )}

                {/* Standings Tab */}
                {activeTab === 'standings' && (
                  <section className="section-standings">
                    <h2>🏆 League Standings</h2>
                    <StandingsTable />
                  </section>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="app-footer">
            <p>
              ⚽ Sports Hub • {new Date().getFullYear()} • Real-time Sports Updates
            </p>
          </footer>
        </div>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
