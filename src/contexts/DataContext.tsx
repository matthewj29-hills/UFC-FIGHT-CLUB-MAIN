import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, addDoc, updateDoc, doc, orderBy, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, Fight, Prediction, UserStats, Fighter } from '../types/data';
import { useAuth } from './AuthContext';

interface DataContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  getUpcomingEvents: () => Promise<void>;
  getEventDetails: (eventId: string) => Promise<Event | null>;
  submitPrediction: (eventId: string, fightId: string, prediction: Omit<Prediction, 'userId' | 'timestamp' | 'locked'>) => Promise<void>;
  getUserStats: (userId: string) => Promise<UserStats>;
  updateFightResult: (eventId: string, fightId: string, result: { winner: string; method: string; round: number; time: string }) => Promise<void>;
  getFighters: () => Promise<Fighter[]>;
  updateFighter: (fighter: Fighter) => Promise<void>;
  deleteFighter: (fighterId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getUpcomingEvents = async (): Promise<void> => {
    try {
      console.log('[DataContext] Fetching upcoming events');
      setLoading(true);
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('status', '==', 'upcoming'),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toISOString(),
        mainCard: doc.data().mainCard || [],
        prelimCard: doc.data().prelimCard || [],
        status: doc.data().status || 'upcoming',
        name: doc.data().name || '',
        location: doc.data().location || '',
        venue: doc.data().venue || '',
        broadcast: doc.data().broadcast || '',
      })) as Event[];
      setEvents(fetchedEvents);
    } catch (err: any) {
      console.error('[DataContext] Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getEventDetails = async (eventId: string): Promise<Event | null> => {
    try {
      console.log('[DataContext] Fetching event details:', eventId);
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        console.log('[DataContext] Event not found:', eventId);
        return null;
      }
      
      const data = eventDoc.data();
      return {
        id: eventDoc.id,
        ...data,
        date: data.date.toDate().toISOString(),
        mainCard: data.mainCard || [],
        prelimCard: data.prelimCard || [],
        status: data.status || 'upcoming',
        name: data.name || '',
        location: data.location || '',
        venue: data.venue || '',
        broadcast: data.broadcast || '',
      } as Event;
    } catch (err: any) {
      console.error('[DataContext] Error fetching event details:', err);
      throw new Error('Failed to fetch event details');
    }
  };

  const submitPrediction = async (
    eventId: string,
    fightId: string,
    prediction: Omit<Prediction, 'userId' | 'timestamp' | 'locked'>
  ): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to submit predictions');
    }

    try {
      console.log('[DataContext] Submitting prediction:', { eventId, fightId });
      const predictionRef = collection(db, 'predictions');
      await addDoc(predictionRef, {
        userId: user.uid,
        ...prediction,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[DataContext] Error submitting prediction:', err);
      throw new Error('Failed to submit prediction');
    }
  };

  const getUserStats = async (userId: string): Promise<UserStats> => {
    try {
      console.log('[DataContext] Fetching user stats:', userId);
      const userStatsRef = doc(db, 'userStats', userId);
      const userStatsDoc = await getDoc(userStatsRef);
      
      if (!userStatsDoc.exists()) {
        // Return default stats if none exist
        return {
          userId,
          totalPredictions: 0,
          correctPredictions: 0,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          biggestUpset: {
            eventId: '',
            fightId: '',
            points: 0,
            odds: 0,
          },
          accuracy: 0,
          rank: 0,
          lastThreePredictions: [],
          favoriteWeightClass: '',
          bestPerformingWeightClass: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          points: 0,
          bestStreak: 0,
          upsetsPredicted: 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      return userStatsDoc.data() as UserStats;
    } catch (err: any) {
      console.error('[DataContext] Error fetching user stats:', err);
      throw new Error('Failed to fetch user stats');
    }
  };

  const updateFightResult = async (
    eventId: string,
    fightId: string,
    result: { winner: string; method: string; round: number; time: string }
  ): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to update fight results');
    }

    try {
      console.log('[DataContext] Updating fight result:', { eventId, fightId, result });
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const event = eventDoc.data() as Event;
      const allFights = [...event.mainCard, ...event.prelimCard];
      const fightIndex = allFights.findIndex(f => f.id === fightId);
      
      if (fightIndex === -1) {
        throw new Error('Fight not found');
      }

      const updatedFight = {
        ...allFights[fightIndex],
        winner: result.winner,
        method: result.method,
        time: result.time,
        status: 'completed' as const,
      };

      // Update the fight in the appropriate card
      if (event.mainCard.find(f => f.id === fightId)) {
        const mainCardIndex = event.mainCard.findIndex(f => f.id === fightId);
        event.mainCard[mainCardIndex] = updatedFight;
      } else {
        const prelimCardIndex = event.prelimCard.findIndex(f => f.id === fightId);
        event.prelimCard[prelimCardIndex] = updatedFight;
      }

      await updateDoc(eventRef, {
        mainCard: event.mainCard,
        prelimCard: event.prelimCard
      });
    } catch (err: any) {
      console.error('[DataContext] Error updating fight result:', err);
      throw new Error('Failed to update fight result');
    }
  };

  const getFighters = async (): Promise<Fighter[]> => {
    try {
      console.log('[DataContext] Fetching all fighters');
      const fightersRef = collection(db, 'fighters');
      const querySnapshot = await getDocs(fightersRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Fighter[];
    } catch (err: any) {
      console.error('[DataContext] Error fetching fighters:', err);
      throw new Error('Failed to fetch fighters');
    }
  };

  const updateFighter = async (fighter: Fighter): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to update fighters');
    }

    try {
      console.log('[DataContext] Updating fighter:', fighter.id);
      const fighterRef = doc(db, 'fighters', fighter.id);
      await updateDoc(fighterRef, {
        ...fighter,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('[DataContext] Error updating fighter:', err);
      throw new Error('Failed to update fighter');
    }
  };

  const deleteFighter = async (fighterId: string): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to delete fighters');
    }

    try {
      const fighterRef = doc(db, 'fighters', fighterId);
      await deleteDoc(fighterRef);
    } catch (err: any) {
      console.error('Error deleting fighter:', err);
      throw new Error('Failed to delete fighter');
    }
  };

  useEffect(() => {
    getUpcomingEvents();
  }, []);

  return (
    <DataContext.Provider
      value={{
        events,
        loading,
        error,
        getUpcomingEvents,
        getEventDetails,
        submitPrediction,
        getUserStats,
        updateFightResult,
        getFighters,
        updateFighter,
        deleteFighter,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 