import React, { createContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // State Management
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('sh-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState(new Set());
  const [liveMatches, setLiveMatches] = useState(new Map());

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('sh-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Favorite Management
  const addFavorite = useCallback((item) => {
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
    pushNotification(`⭐ ${item.team1} vs ${item.team2} added to favorites`, 'success');
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  const isFavorite = useCallback((id) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  // Notification Management (Toasts)
  const pushNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    return id;
  }, []);

  // Scheduled Matches Management
  const addScheduledMatch = useCallback((matchId) => {
    setScheduledMatches(prev => new Set([...prev, matchId]));
  }, []);

  const removeScheduledMatch = useCallback((matchId) => {
    setScheduledMatches(prev => {
      const newSet = new Set(prev);
      newSet.delete(matchId);
      return newSet;
    });
  }, []);

  const isMatchScheduled = useCallback((matchId) => {
    return scheduledMatches.has(matchId);
  }, [scheduledMatches]);

  // Live Match Tracking
  const updateLiveMatch = useCallback((matchId, data) => {
    setLiveMatches(prev => new Map(prev).set(matchId, data));
  }, []);

  const getLiveMatch = useCallback((matchId) => {
    return liveMatches.get(matchId);
  }, [liveMatches]);

  // Compare Feature
  const toggleCompare = useCallback((player) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === player.id);
      
      if (exists) {
        return prev.filter(p => p.id !== player.id);
      }

      if (prev.length < 2) {
        return [...prev, player];
      }

      return prev;
    });
  }, []);

  const isInCompare = useCallback((playerId) => {
    return compareList.some(p => p.id === playerId);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const value = {
    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,

    // Notifications
    notifications,
    pushNotification,

    // Scheduled Matches
    scheduledMatches,
    addScheduledMatch,
    removeScheduledMatch,
    isMatchScheduled,

    // Live Matches
    liveMatches,
    updateLiveMatch,
    getLiveMatch,

    // Compare
    compareList,
    toggleCompare,
    isInCompare,
    clearCompare,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

export default AppContext;
