import NodeCache from 'node-cache';
import { Event, Fight, UserPrediction, LeaderboardEntry, UserStats } from '../types/data';
import { CACHE_KEYS, CACHE_EXPIRY } from '../utils';

interface CacheItem {
  value: string;
  expiry: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;
  private storage: Storage;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_EXPIRY.UPCOMING_EVENTS,
      checkperiod: 120,
    });
    this.storage = window.localStorage;
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public static readonly KEYS = {
    UPCOMING_EVENTS: 'upcoming_events',
    EVENT_FIGHTS: (eventId: string) => `event_fights_${eventId}`,
    FIGHTER_STATS: (fighterId: string) => `fighter_stats_${fighterId}`,
    FIGHT_ODDS: (fightId: string) => `fight_odds_${fightId}`,
    USER_PREDICTIONS: (userId: string) => `user_predictions_${userId}`,
    USER_STATS: (userId: string) => `user_stats_${userId}`,
    LEADERBOARD: 'leaderboard',
  };

  public static readonly TTL = {
    EVENTS: 3600, // 1 hour
    FIGHTS: 3600, // 1 hour
    FIGHTER_STATS: 86400, // 24 hours
    ODDS_NORMAL: 10800, // 3 hours
    ODDS_FIGHT_DAY: 600, // 10 minutes
    USER_DATA: 300, // 5 minutes
    LEADERBOARD: 300, // 5 minutes
  };

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key) || null;
  }

  async set<T>(key: string, value: T, ttl: number = CACHE_EXPIRY.UPCOMING_EVENTS): Promise<void> {
    this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    this.cache.del(key);
  }

  async flush(): Promise<void> {
    this.cache.flushAll();
  }

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_EXPIRY.UPCOMING_EVENTS
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  private async getCacheTimestamp(key: string): Promise<number> {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP(key));
      return timestamp ? parseInt(timestamp, 10) : 0;
    } catch (error) {
      console.error('Error getting cache timestamp:', error);
      return 0;
    }
  }

  private async setCacheTimestamp(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CACHE_KEYS.CACHE_TIMESTAMP(key),
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error setting cache timestamp:', error);
    }
  }

  private isCacheValid(timestamp: number, expiryTime: number): boolean {
    return Date.now() - timestamp < expiryTime;
  }

  public async cacheEvents(events: Event[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(events));
      await this.setCacheTimestamp(CACHE_KEYS.EVENTS);
    } catch (error) {
      console.error('Error caching events:', error);
    }
  }

  public async getCachedEvents(): Promise<Event[] | null> {
    try {
      const timestamp = await this.getCacheTimestamp(CACHE_KEYS.EVENTS);
      if (!this.isCacheValid(timestamp, CACHE_EXPIRY.EVENTS)) {
        return null;
      }

      const eventsJson = await AsyncStorage.getItem(CACHE_KEYS.EVENTS);
      return eventsJson ? JSON.parse(eventsJson) : null;
    } catch (error) {
      console.error('Error getting cached events:', error);
      return null;
    }
  }

  public async cacheFight(fightId: string, fight: Fight): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.FIGHT(fightId), JSON.stringify(fight));
      await this.setCacheTimestamp(CACHE_KEYS.FIGHT(fightId));
    } catch (error) {
      console.error('Error caching fight:', error);
    }
  }

  public async getCachedFight(fightId: string): Promise<Fight | null> {
    try {
      const timestamp = await this.getCacheTimestamp(CACHE_KEYS.FIGHT(fightId));
      if (!this.isCacheValid(timestamp, CACHE_EXPIRY.FIGHT)) {
        return null;
      }

      const fightJson = await AsyncStorage.getItem(CACHE_KEYS.FIGHT(fightId));
      return fightJson ? JSON.parse(fightJson) : null;
    } catch (error) {
      console.error('Error getting cached fight:', error);
      return null;
    }
  }

  public async cacheUserPredictions(userId: string, predictions: UserPrediction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CACHE_KEYS.USER_PREDICTIONS(userId),
        JSON.stringify(predictions)
      );
      await this.setCacheTimestamp(CACHE_KEYS.USER_PREDICTIONS(userId));
    } catch (error) {
      console.error('Error caching user predictions:', error);
    }
  }

  public async getCachedUserPredictions(userId: string): Promise<UserPrediction[] | null> {
    try {
      const timestamp = await this.getCacheTimestamp(CACHE_KEYS.USER_PREDICTIONS(userId));
      if (!this.isCacheValid(timestamp, CACHE_EXPIRY.USER_PREDICTIONS)) {
        return null;
      }

      const predictionsJson = await AsyncStorage.getItem(CACHE_KEYS.USER_PREDICTIONS(userId));
      return predictionsJson ? JSON.parse(predictionsJson) : null;
    } catch (error) {
      console.error('Error getting cached user predictions:', error);
      return null;
    }
  }

  public async cacheUserStats(userId: string, stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.USER_STATS(userId), JSON.stringify(stats));
      await this.setCacheTimestamp(CACHE_KEYS.USER_STATS(userId));
    } catch (error) {
      console.error('Error caching user stats:', error);
    }
  }

  public async getCachedUserStats(userId: string): Promise<UserStats | null> {
    try {
      const timestamp = await this.getCacheTimestamp(CACHE_KEYS.USER_STATS(userId));
      if (!this.isCacheValid(timestamp, CACHE_EXPIRY.USER_STATS)) {
        return null;
      }

      const statsJson = await AsyncStorage.getItem(CACHE_KEYS.USER_STATS(userId));
      return statsJson ? JSON.parse(statsJson) : null;
    } catch (error) {
      console.error('Error getting cached user stats:', error);
      return null;
    }
  }

  public async cacheLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.LEADERBOARD, JSON.stringify(entries));
      await this.setCacheTimestamp(CACHE_KEYS.LEADERBOARD);
    } catch (error) {
      console.error('Error caching leaderboard:', error);
    }
  }

  public async getCachedLeaderboard(): Promise<LeaderboardEntry[] | null> {
    try {
      const timestamp = await this.getCacheTimestamp(CACHE_KEYS.LEADERBOARD);
      if (!this.isCacheValid(timestamp, CACHE_EXPIRY.LEADERBOARD)) {
        return null;
      }

      const leaderboardJson = await AsyncStorage.getItem(CACHE_KEYS.LEADERBOARD);
      return leaderboardJson ? JSON.parse(leaderboardJson) : null;
    } catch (error) {
      console.error('Error getting cached leaderboard:', error);
      return null;
    }
  }

  public async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const item: CacheItem = {
      value,
      expiry: Date.now() + (ttlSeconds * 1000),
    };
    this.storage.setItem(key, JSON.stringify(item));
  }

  async get(key: string): Promise<string | null> {
    const item = this.storage.getItem(key);
    if (!item) return null;

    const cacheItem: CacheItem = JSON.parse(item);
    if (Date.now() > cacheItem.expiry) {
      this.storage.removeItem(key);
      return null;
    }

    return cacheItem.value;
  }

  async remove(key: string): Promise<void> {
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

export default CacheService; 