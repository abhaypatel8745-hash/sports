/* Sports Hub Configuration */

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
    TIMEOUT: 10000,
    POLLING_INTERVAL: 10000, // 10 seconds
  },

  // Theme Configuration
  THEME: {
    DEFAULT: 'dark', // 'dark' | 'light' | 'custom'
    STORAGE_KEY: 'sports-theme',
    AVAILABLE_THEMES: ['dark', 'light', 'custom'],
  },

  // Notification Configuration
  NOTIFICATIONS: {
    AUTO_DISMISS: 4000, // 4 seconds
    POSITION: 'top-right', // 'top-right' | 'top-center' | 'bottom-right'
    MAX_NOTIFICATIONS: 5,
    BROWSER_NOTIFICATIONS: true,
    NOTIFICATION_PERMISSION_PROMPT: true,
  },

  // Match Schedule Configuration
  MATCH_SCHEDULE: {
    DEFAULT_NOTIFICATION_TIME: 15, // minutes before match
    TIMEZONE: 'auto', // 'auto' or specific timezone
    TIME_FORMAT: '24h', // '24h' or '12h'
  },

  // Live Match Configuration
  LIVE_MATCH: {
    UPDATE_INTERVAL: 5000, // 5 seconds
    SHOW_SCOREBOARD: true,
    SHOW_STATISTICS: true,
    SHOW_EVENTS_TIMELINE: true,
    MAX_EVENTS_DISPLAY: 10,
  },

  // Feature Flags
  FEATURES: {
    WEBSOCKET: true,
    LIVE_TRACKING: true,
    MATCH_HIGHLIGHTS: true,
    MATCH_SCHEDULE: true,
    NOTIFICATIONS: true,
    PLAYER_COMPARE: true,
    FAVORITES: true,
    SEARCH: true,
    NEWS_FEED: true,
    STANDINGS: true,
  },

  // UI Configuration
  UI: {
    ANIMATION_ENABLED: true,
    GLASS_EFFECT: true,
    DARK_MODE_BY_DEFAULT: true,
    COMPACT_MODE: false,
    LANGUAGE: 'en', // Language code
  },

  // Sports & Leagues
  SPORTS: {
    ENABLED: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Baseball'],
    FEATURED: ['Football', 'Basketball'],
  },

  LEAGUES: {
    FOOTBALL: ['Premier League', 'La Liga', 'Serie A', 'Champions League'],
    BASKETBALL: ['NBA', 'EuroLeague'],
    TENNIS: ['Wimbledon', 'US Open', 'Australian Open', 'French Open'],
  },

  // Performance
  PERFORMANCE: {
    ENABLE_CODE_SPLITTING: true,
    ENABLE_LAZY_LOADING: true,
    IMAGE_OPTIMIZATION: true,
    CACHE_DURATION: 3600000, // 1 hour
  },

  // Development
  DEBUG: process.env.NODE_ENV === 'development',
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
};

export default CONFIG;
