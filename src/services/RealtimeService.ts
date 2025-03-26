import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, Fight, UserPrediction, LeaderboardEntry } from '../types/data';

class RealtimeService {
  private static instance: RealtimeService;
  private eventListeners: Map<string, Unsubscribe> = new Map();
  private fightListeners: Map<string, Unsubscribe> = new Map();
  private predictionListeners: Map<string, Unsubscribe> = new Map();
  private leaderboardListener: Unsubscribe | null = null;

  private constructor() {}

  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  public subscribeToUpcomingEvents(callback: (events: Event[]) => void): Unsubscribe {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('date', '>=', new Date().toISOString()),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, 'id'>),
      })) as Event[];
      callback(events);
    });

    return unsubscribe;
  }

  public subscribeToFight(fightId: string, callback: (fight: Fight | null) => void): Unsubscribe {
    if (this.fightListeners.has(fightId)) {
      this.fightListeners.get(fightId)!();
    }

    const fightsRef = collection(db, 'fights');
    const q = query(fightsRef, where('id', '==', fightId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const fight = {
        id: snapshot.docs[0].id,
        ...(snapshot.docs[0].data() as Omit<Fight, 'id'>),
      } as Fight;
      callback(fight);
    });

    this.fightListeners.set(fightId, unsubscribe);
    return unsubscribe;
  }

  public subscribeToUserPredictions(
    userId: string,
    callback: (predictions: UserPrediction[]) => void
  ): Unsubscribe {
    if (this.predictionListeners.has(userId)) {
      this.predictionListeners.get(userId)!();
    }

    const predictionsRef = collection(db, 'predictions');
    const q = query(
      predictionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const predictions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserPrediction, 'id'>),
      })) as UserPrediction[];
      callback(predictions);
    });

    this.predictionListeners.set(userId, unsubscribe);
    return unsubscribe;
  }

  public subscribeToLeaderboard(callback: (entries: LeaderboardEntry[]) => void): Unsubscribe {
    if (this.leaderboardListener) {
      this.leaderboardListener();
    }

    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(leaderboardRef, orderBy('points', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...(doc.data() as Omit<LeaderboardEntry, 'id' | 'rank'>),
        rank: index + 1,
      })) as LeaderboardEntry[];
      callback(entries);
    });

    this.leaderboardListener = unsubscribe;
    return unsubscribe;
  }

  public unsubscribeFromFight(fightId: string): void {
    const unsubscribe = this.fightListeners.get(fightId);
    if (unsubscribe) {
      unsubscribe();
      this.fightListeners.delete(fightId);
    }
  }

  public unsubscribeFromUserPredictions(userId: string): void {
    const unsubscribe = this.predictionListeners.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.predictionListeners.delete(userId);
    }
  }

  public unsubscribeFromLeaderboard(): void {
    if (this.leaderboardListener) {
      this.leaderboardListener();
      this.leaderboardListener = null;
    }
  }

  public unsubscribeAll(): void {
    this.fightListeners.forEach((unsubscribe) => unsubscribe());
    this.predictionListeners.forEach((unsubscribe) => unsubscribe());
    if (this.leaderboardListener) {
      this.leaderboardListener();
    }

    this.fightListeners.clear();
    this.predictionListeners.clear();
    this.leaderboardListener = null;
  }
}

export default RealtimeService; 