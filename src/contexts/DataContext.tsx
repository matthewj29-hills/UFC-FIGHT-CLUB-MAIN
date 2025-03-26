import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import DataService from '../services/DataService';
import RealtimeService from '../services/RealtimeService';
import { Event, Fight, Fighter, UserPrediction, LeaderboardEntry, UserStats } from '../types/data';

interface DataContextType {
  upcomingEvents: Event[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  getFighter: (id: string) => Promise<Fighter>;
  makePrediction: (prediction: UserPrediction) => Promise<void>;
  getUserPredictions: (userId: string) => Promise<UserPrediction[]>;
  getUserStats: (userId: string) => Promise<UserStats>;
  events: Event[];
  currentFight: Fight | null;
  userPredictions: UserPrediction[];
  leaderboard: LeaderboardEntry[];
  userStats: UserStats | null;
  loading: {
    events: boolean;
    fight: boolean;
    predictions: boolean;
    leaderboard: boolean;
    stats: boolean;
  };
  submitPrediction: (prediction: Omit<UserPrediction, 'isCorrect'>) => Promise<void>;
  setCurrentFightId: (fightId: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentFight, setCurrentFight] = useState<Fight | null>(null);
  const [currentFightId, setCurrentFightId] = useState<string | null>(null);
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState({
    events: true,
    fight: false,
    predictions: true,
    leaderboard: true,
    stats: true,
  });

  const dataService = DataService.getInstance();
  const realtimeService = RealtimeService.getInstance();

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const events = await dataService.getUpcomingEvents();
      setUpcomingEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const refreshEvents = async () => {
    await loadEvents();
  };

  const getEventById = (id: string) => {
    return upcomingEvents.find(event => event.id === id);
  };

  const getFighter = async (id: string) => {
    return await dataService.getFighter(id);
  };

  const makePrediction = async (prediction: UserPrediction) => {
    await dataService.makePrediction(prediction);
  };

  const getUserPredictions = async (userId: string) => {
    return await dataService.getUserPredictions(userId);
  };

  const getUserStats = async (userId: string) => {
    return await dataService.getUserStats(userId);
  };

  // Subscribe to upcoming events
  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToUpcomingEvents((updatedEvents) => {
      setEvents(updatedEvents);
      setLoading((prev) => ({ ...prev, events: false }));
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to current fight
  useEffect(() => {
    if (!currentFightId) {
      setCurrentFight(null);
      setLoading((prev) => ({ ...prev, fight: false }));
      return;
    }

    setLoading((prev) => ({ ...prev, fight: true }));
    const unsubscribe = realtimeService.subscribeToFight(currentFightId, (fight) => {
      setCurrentFight(fight);
      setLoading((prev) => ({ ...prev, fight: false }));
    });

    return () => {
      unsubscribe();
      realtimeService.unsubscribeFromFight(currentFightId);
    };
  }, [currentFightId]);

  // Subscribe to user predictions
  useEffect(() => {
    if (!user) {
      setUserPredictions([]);
      setLoading((prev) => ({ ...prev, predictions: false }));
      return;
    }

    setLoading((prev) => ({ ...prev, predictions: true }));
    const unsubscribe = realtimeService.subscribeToUserPredictions(
      user.id,
      (predictions) => {
        setUserPredictions(predictions);
        setLoading((prev) => ({ ...prev, predictions: false }));
      }
    );

    return () => {
      unsubscribe();
      realtimeService.unsubscribeFromUserPredictions(user.id);
    };
  }, [user]);

  // Subscribe to leaderboard
  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToLeaderboard((entries) => {
      setLeaderboard(entries);
      setLoading((prev) => ({ ...prev, leaderboard: false }));
    });

    return () => {
      unsubscribe();
      realtimeService.unsubscribeFromLeaderboard();
    };
  }, []);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setUserStats(null);
        setLoading((prev) => ({ ...prev, stats: false }));
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, stats: true }));
        const stats = await dataService.getUserStats(user.id);
        setUserStats(stats);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to fetch user stats');
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    fetchUserStats();
  }, [user]);

  const submitPrediction = async (prediction: Omit<UserPrediction, 'isCorrect'>) => {
    try {
      setError(null);
      await dataService.submitPrediction(prediction);
    } catch (err) {
      console.error('Error submitting prediction:', err);
      setError('Failed to submit prediction');
      throw err;
    }
  };

  const value = {
    upcomingEvents,
    isLoading,
    error,
    refreshEvents,
    getEventById,
    getFighter,
    makePrediction,
    getUserPredictions,
    getUserStats,
    events,
    currentFight,
    userPredictions,
    leaderboard,
    userStats,
    loading,
    submitPrediction,
    setCurrentFightId,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext; 