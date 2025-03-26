export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  stats?: UserStats;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'upcoming' | 'past';
  imageUrl?: string;
  fights: Fight[];
}

export interface Fight {
  id: string;
  eventId: string;
  fight_number: number;
  weight_class: string;
  redCorner: Fighter;
  blueCorner: Fighter;
  card: 'main' | 'prelim';
  result?: FightResult;
}

export interface Fighter {
  id: string;
  name: string;
  record: string;
  imageUrl?: string;
  weight_class: string;
  rank?: number;
  style: string;
  height: string;
  weight: number;
  recentFights: RecentFight[];
  odds: Odds[];
}

export interface RecentFight {
  date: string;
  opponent: string;
  result: 'W' | 'L' | 'D';
  method: string;
  round: number;
  time: string;
  event: string;
}

export interface FightResult {
  winner: 'red' | 'blue';
  method: string;
  round: number;
  time: string;
}

export interface Prediction {
  id: string;
  userId: string;
  fightId: string;
  winnerId: string;
  timestamp: string;
  eventId: string;
}

export interface UserStats {
  userId: string;
  totalPredictions: number;
  correctPredictions: number;
  points: number;
  rank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  accuracy: number;
  totalPredictions: number;
  currentStreak: number;
}

export type PredictionMethod = 'KO/TKO' | 'Submission' | 'Decision' | 'DQ';

export interface ComingSoonEvent {
  id: string;
  name: string;
  date: string;
  status: 'coming_soon';
  fights: number; // Number of fights expected
}

interface Odds {
  sportsbook: string;
  value: number;
}

export interface DataContextType {
  getEventById: (eventId: string) => Promise<Event | null>;
  getFighter: (fighterId: string) => Promise<Fighter | null>;
  // ... other existing methods ...
} 