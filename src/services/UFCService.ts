import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, Fight, Fighter } from '../types/data';
import CacheService from './CacheService';

class UFCService {
  private static instance: UFCService;
  private cache: CacheService;

  private constructor() {
    this.cache = CacheService.getInstance();
  }

  public static getInstance(): UFCService {
    if (!UFCService.instance) {
      UFCService.instance = new UFCService();
    }
    return UFCService.instance;
  }

  public async getUpcomingEvents(): Promise<Event[]> {
    return this.cache.getOrFetch(
      CacheService.KEYS.UPCOMING_EVENTS,
      async () => {
        try {
          const eventsRef = collection(db, 'events');
          const q = query(
            eventsRef,
            where('status', '==', 'scheduled'),
            orderBy('date', 'asc')
          );
          
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Event[];
        } catch (error) {
          console.error('Error fetching upcoming events:', error);
          return [];
        }
      },
      CacheService.TTL.EVENTS
    );
  }

  public async getEventFights(eventId: string): Promise<Fight[]> {
    return this.cache.getOrFetch(
      CacheService.KEYS.EVENT_FIGHTS(eventId),
      async () => {
        try {
          const fightsRef = collection(db, 'fights');
          const q = query(
            fightsRef,
            where('eventId', '==', eventId),
            orderBy('order', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Fight[];
        } catch (error) {
          console.error('Error fetching event fights:', error);
          return [];
        }
      },
      CacheService.TTL.FIGHTS
    );
  }

  public async getFighterStats(fighterId: string): Promise<Fighter | null> {
    return this.cache.getOrFetch(
      CacheService.KEYS.FIGHTER_STATS(fighterId),
      async () => {
        try {
          const fightersRef = collection(db, 'fighters');
          const q = query(
            fightersRef,
            where('id', '==', fighterId)
          );
          
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            return null;
          }
          
          return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as Fighter;
        } catch (error) {
          console.error('Error fetching fighter stats:', error);
          return null;
        }
      },
      CacheService.TTL.FIGHTER_STATS
    );
  }

  public async getFightOdds(fightId: string) {
    return this.cache.getOrFetch(
      CacheService.KEYS.FIGHT_ODDS(fightId),
      async () => {
        try {
          const oddsRef = collection(db, 'odds');
          const q = query(
            oddsRef,
            where('fightId', '==', fightId),
            orderBy('lastUpdated', 'desc'),
          );
          
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            return null;
          }
          
          return querySnapshot.docs[0].data();
        } catch (error) {
          console.error('Error fetching fight odds:', error);
          return null;
        }
      },
      CacheService.TTL.ODDS_NORMAL
    );
  }
}

export default UFCService; 