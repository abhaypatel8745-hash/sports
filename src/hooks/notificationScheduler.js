// Smart notification scheduler for match events
class NotificationScheduler {
  constructor() {
    this.schedules = new Map();
    this.notificationPermission = null;
    this.checkBrowserPermission();
  }

  checkBrowserPermission() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      if (this.notificationPermission === 'default') {
        Notification.requestPermission().then(permission => {
          this.notificationPermission = permission;
        });
      }
    }
  }

  scheduleMatchNotification(match, options = {}) {
    const {
      notificationTime = 15, // minutes before match
      showBrowserNotification = true,
      callback = null,
    } = options;

    const matchTime = new Date(match.startTime);
    const notificationTime_ms = matchTime.getTime() - (notificationTime * 60 * 1000);
    const now = Date.now();

    if (notificationTime_ms > now) {
      const delay = notificationTime_ms - now;
      const scheduleId = `${match.id}-${notificationTime}`;

      const timeoutId = setTimeout(() => {
        this.triggerNotification(match, showBrowserNotification, callback);
        this.schedules.delete(scheduleId);
      }, delay);

      this.schedules.set(scheduleId, { timeoutId, match, delay });
      return scheduleId;
    }

    return null;
  }

  triggerNotification(match, showBrowser = true, callback = null) {
    const message = `🎯 ${match.team1} vs ${match.team2} starting in 15 minutes!`;

    if (showBrowser && this.notificationPermission === 'granted') {
      new Notification('Sports Hub', {
        body: message,
        icon: '⚽',
        badge: '🏆',
        tag: `match-${match.id}`,
      });
    }

    if (callback) {
      callback(match);
    }
  }

  scheduleMatchStart(match, callback = null) {
    const matchTime = new Date(match.startTime);
    const now = Date.now();
    const delay = matchTime.getTime() - now;

    if (delay > 0) {
      const scheduleId = `${match.id}-start`;

      const timeoutId = setTimeout(() => {
        this.triggerMatchStartNotification(match, callback);
        this.schedules.delete(scheduleId);
      }, delay);

      this.schedules.set(scheduleId, { timeoutId, match, delay });
      return scheduleId;
    }

    return null;
  }

 triggerMatchStartNotification(match, callback) {
    const message = `⚽ LIVE: ${match.team1} vs ${match.team2} is now LIVE!`;

    if (this.notificationPermission === 'granted') {
      new Notification('🔴 LIVE - Sports Hub', {
        body: message,
        icon: '🎯',
        badge: '🔴',
        tag: `live-${match.id}`,
        requireInteraction: true,
      });
    }

    if (callback) {
      callback(match);
    }
  }

  scheduleGoalAlert(match, team, callback = null) {
    // Immediate notification for goals
    const message = `⚽ GOAL! ${team} scores in ${match.team1} vs ${match.team2}`;

    if (this.notificationPermission === 'granted') {
      new Notification('⚽ GOAL! - Sports Hub', {
        body: message,
        icon: '⚡',
        badge: '⚽',
        tag: `goal-${match.id}-${Date.now()}`,
      });
    }

    if (callback) {
      callback(match, team);
    }
  }

  cancelSchedule(scheduleId) {
    if (this.schedules.has(scheduleId)) {
      const { timeoutId } = this.schedules.get(scheduleId);
      clearTimeout(timeoutId);
      this.schedules.delete(scheduleId);
      return true;
    }
    return false;
  }

  cancelAllSchedules() {
    this.schedules.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    this.schedules.clear();
  }

  getScheduledMatches() {
    return Array.from(this.schedules.values()).map(({ match, delay }) => ({
      ...match,
      timeUntilNotification: Math.round(delay / 1000),
    }));
  }
}

export const notificationScheduler = new NotificationScheduler();
