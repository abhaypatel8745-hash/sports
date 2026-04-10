import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketManager } from './useWebSocket.js';

// React hook for WebSocket
export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState({});
  const subscriptionsRef = useRef([]);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await websocketManager.connect();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        // Fallback: use polling if WebSocket fails
      }
    };

    connectWebSocket();

    // Subscribe to events
    const unsubscribers = [
      websocketManager.subscribe('connected', () => setIsConnected(true)),
      websocketManager.subscribe('disconnected', () => setIsConnected(false)),
      websocketManager.subscribe('match:update', (data) => {
        setLiveData(prev => ({
          ...prev,
          [`match-${data.id}`]: data
        }));
      }),
      websocketManager.subscribe('match:goal', (data) => {
        setLiveData(prev => ({
          ...prev,
          [`goal-${data.id}`]: data
        }));
      }),
    ];

    subscriptionsRef.current = unsubscribers;

    return () => {
      unsubscribers.forEach(unsub => unsub?.());
    };
  }, []);

  const sendUpdate = useCallback((type, payload) => {
    websocketManager.send(type, payload);
  }, []);

  return {
    isConnected,
    liveData,
    sendUpdate,
    subscribe: (event, callback) => {
      const unsub = websocketManager.subscribe(event, callback);
      subscriptionsRef.current.push(unsub);
      return unsub;
    }
  };
};

export default useRealTimeUpdates;
