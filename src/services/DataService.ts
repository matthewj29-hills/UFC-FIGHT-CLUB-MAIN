import axios from 'axios';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import CacheService from './CacheService';
import {
  Event,
  Fight,
  Fighter,
  UserPrediction,
  UserStats,
  LeaderboardEntry,
  Prediction,
  User,
  PredictionMethod,
  FightResult,
} from '../types/data';
import UFCScraperService from './UFCScraperService';
import { CACHE_KEYS, createNotFoundError } from '../utils';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  username: string;
  points: number;
}

export class DataService {
  private static instance: DataService;
  private scraper: UFCScraperService;
  private cache: CacheService;
  private UFC_API_URL = 'https://api.ufc.com/api/v3/events'; // Example API URL

  private constructor() {
    this.scraper = UFCScraperService.getInstance();
    this.cache = CacheService.getInstance();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public async getUpcomingEvents(): Promise<Event[]> {
    const cacheKey = 'upcoming_events';
    const cached = await this.cache.get<Event[]>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];

    await this.cache.set(cacheKey, events, 300); // Cache for 5 minutes
    return events;
  }

  public async getEventById(eventId: string): Promise<Event> {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      throw createNotFoundError('Event not found');
    }

    return {
      id: eventDoc.id,
      ...eventDoc.data()
    } as Event;
  }

  public async getFighterById(fighterId: string): Promise<Fighter> {
    const cached = await this.cache.get<Fighter>(`${CACHE_KEYS.FIGHTER_STATS}_${fighterId}`);
    if (cached) return cached;

    const fighterRef = doc(db, 'fighters', fighterId);
    const fighterDoc = await getDoc(fighterRef);

    if (!fighterDoc.exists()) {
      throw createNotFoundError('Fighter not found');
    }

    const fighter = {
      id: fighterDoc.id,
      ...fighterDoc.data()
    } as Fighter;

    await this.cache.set(`${CACHE_KEYS.FIGHTER_STATS}_${fighterId}`, fighter);
    return fighter;
  }

  public async getFightById(fightId: string): Promise<Fight> {
    const cacheKey = `fight_${fightId}`;
    const cached = await this.cache.get<Fight>(cacheKey);
    if (cached) return cached;

    const fightRef = doc(db, 'fights', fightId);
    const fightDoc = await getDoc(fightRef);

    if (!fightDoc.exists()) {
      throw createNotFoundError('Fight not found');
    }

    const fight = {
      id: fightDoc.id,
      ...fightDoc.data()
    } as Fight;

    await this.cache.set(cacheKey, fight, 300);
    return fight;
  }

  public async updateFightOdds(fightId: string): Promise<void> {
    const lastUpdate = await this.cache.get<{
      fighter1: number;
      fighter2: number;
      lastUpdated: Date;
    }>(CacheService.KEYS.FIGHT_ODDS(fightId));
    if (!lastUpdate || this.shouldUpdateOdds(lastUpdate.lastUpdated)) {
      await this.scraper.updateFightOdds(fightId);
    }
  }

  private shouldUpdateOdds(lastUpdate: Date): boolean {
    const now = new Date();
    const hoursSinceLastUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    // Update more frequently on fight day
    const isFightDay = false; // TODO: Implement fight day check
    const updateInterval = isFightDay ? 0.17 : 3; // 10 minutes on fight day, 3 hours otherwise
    
    return hoursSinceLastUpdate >= updateInterval;
  }

  // User predictions and stats
  public async getUserPredictions(userId: string): Promise<Prediction[]> {
    const predictionsRef = collection(db, 'predictions');
    const q = query(
      predictionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
  }

  public async setUserPrediction(userId: string, fightId: string, prediction: string): Promise<void> {
    const fight = await this.getFightById(fightId);
    if (!fight) {
      throw new Error('Fight not found');
    }

    const event = await this.getEventById(fight.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if the card is locked
    const now = new Date();
    const lockInTime = fight.card === 'prelim' 
      ? new Date(event.prelimLockInTime)
      : new Date(event.mainCardLockInTime);

    if (now >= lockInTime) {
      throw new Error(`${fight.card === 'prelim' ? 'Prelims' : 'Main card'} are locked. No more predictions allowed.`);
    }

    // Create prediction document
    const predictionRef = collection(db, 'predictions');
    await addDoc(predictionRef, {
      userId,
      fightId,
      winnerId: prediction,
      timestamp: Timestamp.now(),
      eventId: fight.eventId,
      card: fight.card,
      status: 'pending'
    });

    // Update cache
    const predictions = await this.getUserPredictions(userId);
    predictions[fightId] = prediction;
    await this.cache.set(CacheService.KEYS.USER_PREDICTIONS(userId), predictions);
  }

  public async getUserStats(userId: string): Promise<UserStats> {
    const cacheKey = `stats_${userId}`;
    const cached = await this.cache.get<UserStats>(cacheKey);
    if (cached) return cached;

    const predictionsRef = collection(db, 'predictions');
    const q = query(predictionsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const predictions = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Prediction[];

    const stats: UserStats = {
      totalPredictions: predictions.length,
      correctPredictions: predictions.filter(p => p.isCorrect).length,
      accuracy: predictions.length > 0 
        ? predictions.filter(p => p.isCorrect).length / predictions.length 
        : 0,
      currentStreak: this.calculateCurrentStreak(predictions),
      bestStreak: this.calculateBestStreak(predictions),
      methodAccuracy: this.calculateMethodAccuracy(predictions),
      roundAccuracy: this.calculateRoundAccuracy(predictions),
    };

    await this.cache.set(cacheKey, stats, 300);
    return stats;
  }

  public async updateUserStats(userId: string, fightId: string, wasCorrect: boolean): Promise<void> {
    const stats = await this.getUserStats(userId);
    const fight = await this.getFightById(fightId);

    if (!fight) {
      return;
    }

    stats.totalPredictions++;
    if (wasCorrect) {
      stats.correctPredictions++;
      stats.currentStreak++;
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);

      // Calculate points based on odds
      const prediction = (await this.getUserPredictions(userId))[fightId];
      const odds = prediction === 'fighter1' ? fight.odds.fighter1 : fight.odds.fighter2;
      
      // Base points for correct prediction
      let points = 10;
      
      // Bonus points for underdog wins (positive odds)
      if (odds > 0) {
        points += Math.floor(odds / 100);
      }
      
      stats.points += points;
    } else {
      stats.currentStreak = 0;
    }

    stats.accuracy = (stats.correctPredictions / stats.totalPredictions) * 100;
    await this.cache.set(CacheService.KEYS.USER_STATS(userId), stats);
  }

  // Leaderboard
  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const cacheKey = 'leaderboard';
    const cached = await this.cache.get<LeaderboardEntry[]>(cacheKey);
    if (cached) return cached;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('points', 'desc'), limit(100));
    const snapshot = await getDocs(q);

    const leaderboard = await Promise.all(
      snapshot.docs.map(async doc => {
        const userData = doc.data() as User;
        const stats = await this.getUserStats(doc.id);
        return {
          userId: doc.id,
          username: userData.username,
          points: userData.points,
          accuracy: stats.accuracy,
          totalPredictions: stats.totalPredictions,
          currentStreak: stats.currentStreak,
        };
      })
    );

    await this.cache.set(cacheKey, leaderboard, 300);
    return leaderboard;
  }

  public async updateLeaderboard(): Promise<void> {
    // TODO: Implement leaderboard update logic
    // This would typically involve:
    // 1. Getting all user stats
    // 2. Sorting by points
    // 3. Taking top N users
    // 4. Caching the result
  }

  public async createPrediction(prediction: Omit<Prediction, 'isCorrect'>): Promise<void> {
    const predictionsRef = collection(db, 'predictions');
    await addDoc(predictionsRef, {
      ...prediction,
      timestamp: Timestamp.now()
    });

    // Invalidate user stats cache
    await this.cache.delete(`stats_${prediction.userId}`);
  }

  public async updatePredictionResult(predictionId: string, isCorrect: boolean): Promise<void> {
    const predictionRef = doc(db, 'predictions', predictionId);
    const predictionDoc = await getDoc(predictionRef);

    if (!predictionDoc.exists()) {
      throw createNotFoundError('Prediction not found');
    }

    const prediction = predictionDoc.data() as Prediction;
    await updateDoc(predictionRef, { isCorrect });

    // Update user's correct prediction count if the prediction was correct
    if (isCorrect) {
      const userRef = doc(db, 'users', prediction.userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as User;

      await updateDoc(userRef, {
        correctPredictions: userData.correctPredictions + 1
      });
    }
  }

  private calculateCurrentStreak(predictions: Prediction[]): number {
    let streak = 0;
    const sortedPredictions = [...predictions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    for (const prediction of sortedPredictions) {
      if (prediction.isCorrect) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateBestStreak(predictions: Prediction[]): number {
    let currentStreak = 0;
    let bestStreak = 0;
    const sortedPredictions = [...predictions].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (const prediction of sortedPredictions) {
      if (prediction.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return bestStreak;
  }

  private calculateMethodAccuracy(predictions: Prediction[]): { [key in PredictionMethod]: number } {
    const methodStats: { [key in PredictionMethod]: { correct: number; total: number } } = {
      'KO/TKO': { correct: 0, total: 0 },
      'Submission': { correct: 0, total: 0 },
      'Decision': { correct: 0, total: 0 },
      'DQ': { correct: 0, total: 0 },
    };

    predictions.forEach(prediction => {
      methodStats[prediction.method].total++;
      if (prediction.isCorrect) {
        methodStats[prediction.method].correct++;
      }
    });

    return Object.entries(methodStats).reduce((acc, [method, stats]) => ({
      ...acc,
      [method]: stats.total > 0 ? stats.correct / stats.total : 0
    }), {} as { [key in PredictionMethod]: number });
  }

  private calculateRoundAccuracy(predictions: Prediction[]): { [key: number]: number } {
    const roundStats: { [key: number]: { correct: number; total: number } } = {};

    predictions.forEach(prediction => {
      if (!roundStats[prediction.round]) {
        roundStats[prediction.round] = { correct: 0, total: 0 };
      }
      roundStats[prediction.round].total++;
      if (prediction.isCorrect) {
        roundStats[prediction.round].correct++;
      }
    });

    return Object.entries(roundStats).reduce((acc, [round, stats]) => ({
      ...acc,
      [Number(round)]: stats.total > 0 ? stats.correct / stats.total : 0
    }), {});
  }

  public async updateFightStatus(fightId: string): Promise<void> {
    const fight = await this.getFightById(fightId);
    if (!fight) return;

    const now = new Date();
    const startTime = new Date(fight.startTime);
    const lockInTime = new Date(fight.lockInTime);

    let newStatus = fight.status;
    if (now >= startTime && fight.status === 'locked') {
      newStatus = 'in_progress';
    } else if (now >= lockInTime && fight.status === 'scheduled') {
      newStatus = 'locked';
    }

    if (newStatus !== fight.status) {
      const fightRef = doc(db, 'fights', fightId);
      await updateDoc(fightRef, {
        status: newStatus,
        ...(newStatus === 'in_progress' && {
          currentRound: 1,
          currentTime: '5:00'
        })
      });

      // Update cache
      await this.cache.delete(`fight_${fightId}`);
    }
  }

  public async updateFightProgress(fightId: string, round: number, time: string): Promise<void> {
    const fight = await this.getFightById(fightId);
    if (!fight || fight.status !== 'in_progress') return;

    const fightRef = doc(db, 'fights', fightId);
    await updateDoc(fightRef, {
      currentRound: round,
      currentTime: time
    });

    // Update cache
    await this.cache.delete(`fight_${fightId}`);
  }

  public async completeFight(fightId: string, result: FightResult): Promise<void> {
    const fight = await this.getFightById(fightId);
    if (!fight || fight.status !== 'in_progress') return;

    const fightRef = doc(db, 'fights', fightId);
    await updateDoc(fightRef, {
      status: 'completed',
      result
    });

    // Update cache
    await this.cache.delete(`fight_${fightId}`);

    // Update predictions and user stats
    const predictionsRef = collection(db, 'predictions');
    const q = query(predictionsRef, where('fightId', '==', fightId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      const prediction = doc.data() as Prediction;
      const isCorrect = prediction.winnerId === result.winner;
      batch.update(doc.ref, { isCorrect });
    });
    await batch.commit();

    // Update user stats
    for (const doc of snapshot.docs) {
      const prediction = doc.data() as Prediction;
      await this.updateUserStats(prediction.userId, fightId, prediction.winnerId === result.winner);
    }
  }

  public async updateEventStatus(eventId: string): Promise<void> {
    const event = await this.getEventById(eventId);
    if (!event) return;

    const now = new Date();
    const prelimLockInTime = new Date(event.prelimLockInTime);
    const mainCardLockInTime = new Date(event.mainCardLockInTime);
    const prelimStartTime = new Date(event.prelimStartTime);
    const mainCardStartTime = new Date(event.mainCardStartTime);

    // Update fights based on card status
    const fightsRef = collection(db, 'fights');
    const q = query(fightsRef, where('eventId', '==', eventId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      const fight = doc.data() as Fight;
      let newStatus = fight.status;

      if (fight.card === 'prelim') {
        if (now >= prelimStartTime && fight.status === 'locked') {
          newStatus = 'in_progress';
        } else if (now >= prelimLockInTime && fight.status === 'scheduled') {
          newStatus = 'locked';
        }
      } else {
        if (now >= mainCardStartTime && fight.status === 'locked') {
          newStatus = 'in_progress';
        } else if (now >= mainCardLockInTime && fight.status === 'scheduled') {
          newStatus = 'locked';
        }
      }

      if (newStatus !== fight.status) {
        batch.update(doc.ref, {
          status: newStatus,
          ...(newStatus === 'in_progress' && {
            currentRound: 1,
            currentTime: '5:00'
          })
        });
      }
    });

    await batch.commit();

    // Update cache
    await this.cache.delete(`event_${eventId}`);
  }

  public async getEventStatus(eventId: string): Promise<{
    prelimStatus: 'scheduled' | 'locked' | 'in_progress' | 'completed';
    mainCardStatus: 'scheduled' | 'locked' | 'in_progress' | 'completed';
  }> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const now = new Date();
    const prelimLockInTime = new Date(event.prelimLockInTime);
    const mainCardLockInTime = new Date(event.mainCardLockInTime);
    const prelimStartTime = new Date(event.prelimStartTime);
    const mainCardStartTime = new Date(event.mainCardStartTime);

    const getCardStatus = (
      lockInTime: Date,
      startTime: Date,
      fights: Fight[]
    ): 'scheduled' | 'locked' | 'in_progress' | 'completed' => {
      if (now >= startTime) {
        return fights.some(f => f.status === 'in_progress') ? 'in_progress' : 'completed';
      }
      if (now >= lockInTime) {
        return 'locked';
      }
      return 'scheduled';
    };

    const prelimFights = event.fights.filter(f => f.card === 'prelim');
    const mainCardFights = event.fights.filter(f => f.card === 'main');

    return {
      prelimStatus: getCardStatus(prelimLockInTime, prelimStartTime, prelimFights),
      mainCardStatus: getCardStatus(mainCardLockInTime, mainCardStartTime, mainCardFights)
    };
  }

  // Helper Methods
  private async fetchFromUFC(): Promise<any> {
    try {
      const response = await axios.get(this.UFC_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching from UFC API:', error);
      throw error;
    }
  }
}

export default DataService; 