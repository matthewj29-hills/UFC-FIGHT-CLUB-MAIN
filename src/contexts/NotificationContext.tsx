import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import NotificationService from '../services/NotificationService';

interface NotificationContextType {
  hasPermission: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  subscribeToFight: (fightId: string) => Promise<void>;
  unsubscribeFromFight: (fightId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        // Request permission
        const permission = await notificationService.requestPermission();
        setHasPermission(permission);

        if (permission) {
          // Get FCM token
          const fcmToken = await notificationService.getFCMToken();
          setToken(fcmToken);

          // Save token if user is logged in
          if (user && fcmToken) {
            await notificationService.saveFCMToken(user.id, fcmToken);
          }
        }
      } catch (err) {
        console.error('Error initializing notifications:', err);
        setError('Failed to initialize notifications');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Set up message handlers
    const unsubscribeMessage = notificationService.onMessage((message) => {
      // Handle foreground messages
      console.log('Received foreground message:', message);
      // TODO: Show in-app notification
    });

    const unsubscribeOpenedApp = notificationService.onNotificationOpenedApp((message) => {
      // Handle notification opened while app was in background
      console.log('Notification opened app:', message);
      // TODO: Navigate to appropriate screen
    });

    // Check if app was opened from notification
    notificationService.getInitialNotification().then((message) => {
      if (message) {
        console.log('App opened from notification:', message);
        // TODO: Navigate to appropriate screen
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeOpenedApp();
    };
  }, [user]);

  // Clean up tokens when user logs out
  useEffect(() => {
    if (!user && token) {
      notificationService.removeFCMToken(user?.id || '', token);
    }
  }, [user, token]);

  const subscribeToFight = async (fightId: string) => {
    try {
      setError(null);
      await notificationService.subscribeToTopic(`fight_${fightId}`);
    } catch (err) {
      console.error('Error subscribing to fight:', err);
      setError('Failed to subscribe to fight notifications');
      throw err;
    }
  };

  const unsubscribeFromFight = async (fightId: string) => {
    try {
      setError(null);
      await notificationService.unsubscribeFromTopic(`fight_${fightId}`);
    } catch (err) {
      console.error('Error unsubscribing from fight:', err);
      setError('Failed to unsubscribe from fight notifications');
      throw err;
    }
  };

  const value = {
    hasPermission,
    token,
    loading,
    error,
    subscribeToFight,
    unsubscribeFromFight,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext; 