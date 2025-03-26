import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Event, Fight, Prediction } from '../types/data';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface PredictionContextType {
  predictions: Record<string, Prediction>;
  isPrelimsLocked: boolean;
  isMainCardLocked: boolean;
  makePrediction: (fightId: string, winnerId: string) => Promise<void>;
  getPrediction: (fightId: string) => Prediction | null;
  getEventPredictions: (eventId: string) => Prediction[];
  checkCardLockStatus: (eventId: string) => Promise<void>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { getEventById } = useData();
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [isPrelimsLocked, setIsPrelimsLocked] = useState(false);
  const [isMainCardLocked, setIsMainCardLocked] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPredictions();
    }
  }, [user]);

  const loadUserPredictions = async () => {
    if (!user) return;

    try {
      const predictionsRef = collection(db, 'predictions');
      const q = query(predictionsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const userPredictions: Record<string, Prediction> = {};
      querySnapshot.forEach((doc) => {
        userPredictions[doc.id] = doc.data() as Prediction;
      });

      setPredictions(userPredictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const makePrediction = async (fightId: string, winnerId: string) => {
    if (!user) return;

    try {
      const prediction: Prediction = {
        id: `${user.uid}_${fightId}`,
        userId: user.uid,
        fightId,
        winnerId,
        timestamp: new Date().toISOString(),
        eventId: fightId.split('_')[0], // Assuming fightId format: eventId_fightNumber
      };

      await setDoc(doc(db, 'predictions', prediction.id), prediction);
      setPredictions(prev => ({
        ...prev,
        [prediction.id]: prediction
      }));
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  };

  const getPrediction = (fightId: string): Prediction | null => {
    if (!user) return null;
    return predictions[`${user.uid}_${fightId}`] || null;
  };

  const getEventPredictions = (eventId: string): Prediction[] => {
    if (!user) return [];
    return Object.values(predictions).filter(p => p.eventId === eventId);
  };

  const checkCardLockStatus = async (eventId: string) => {
    try {
      const event = await getEventById(eventId);
      if (!event) return;

      const now = new Date();
      const firstPrelimFight = event.fights.find(f => f.card === 'prelim');
      const firstMainFight = event.fights.find(f => f.card === 'main');

      if (firstPrelimFight) {
        const prelimStartTime = new Date(firstPrelimFight.startTime);
        setIsPrelimsLocked(now >= prelimStartTime);
      }

      if (firstMainFight) {
        const mainStartTime = new Date(firstMainFight.startTime);
        setIsMainCardLocked(now >= mainStartTime);
      }
    } catch (error) {
      console.error('Error checking card lock status:', error);
    }
  };

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        isPrelimsLocked,
        isMainCardLocked,
        makePrediction,
        getPrediction,
        getEventPredictions,
        checkCardLockStatus,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}; 