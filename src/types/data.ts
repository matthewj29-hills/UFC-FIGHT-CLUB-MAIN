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
  venue: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  mainCard: Fight[];
  prelimCard: Fight[];
  broadcast: string;
  imageUrl?: string;
}

export interface Fight {
  id: string;
  eventId: string;
  fighter1Id: string;
  fighter2Id: string;
  weightClass: string;
  isTitleFight: boolean;
  rounds: number;
  odds: {
    fighter1: string;
    fighter2: string;
  };
  status: 'upcoming' | 'completed' | 'cancelled';
  winner: string | null;
  method: string | null;
  time: string | null;
}

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  record: string;
  height: string;
  weight: number;
  reach: string;
  stance: string;
  imageUrl?: string;
  lastThreeFights: string[];
  nextThreeFights: string[];
  stats: FighterStats;
}

export interface FighterStats {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  winsByKO: number;
  winsBySubmission: number;
  winsByDecision: number;
  lossesByKO: number;
  lossesBySubmission: number;
  lossesByDecision: number;
  averageFightTime: string;
  significantStrikesPerMinute: number;
  significantStrikesAccuracy: number;
  significantStrikesAbsorbedPerMinute: number;
  significantStrikesDefense: number;
  takedownAverage: number;
  takedownAccuracy: number;
  takedownDefense: number;
  submissionAverage: number;
}

export interface FightResult {
  eventId: string;
  eventName: string;
  date: string;
  opponent: string;
  result: 'W' | 'L' | 'D' | 'NC';
  method: string;
  round: number;
  time: string;
  weightClass: string;
}

export interface UpcomingFight {
  eventId: string;
  eventName: string;
  date: string;
  opponent: string;
  weightClass: string;
  odds: number;
}

export interface Prediction {
  userId: string;
  eventId: string;
  fightId: string;
  selectedFighter: string;
  confidence: number;
  timestamp: string;
  points?: number;
  isCorrect?: boolean;
}

export interface UserStats {
  userId: string;
  totalPredictions: number;
  correctPredictions: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  biggestUpset: {
    eventId: string;
    fightId: string;
    points: number;
    odds: number;
  };
  accuracy: number;
  rank: number;
  lastThreePredictions: Prediction[];
  favoriteWeightClass: string;
  bestPerformingWeightClass: string;
  createdAt: string;
  lastLogin: string;
  points: number;
  bestStreak: number;
  upsetsPredicted: number;
  lastUpdated: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  totalPredictions: number;
  correctPredictions: number;
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
  getFighters: () => Promise<Fighter[]>;
  updateFighter: (fighter: Fighter) => Promise<void>;
  deleteFighter: (fighterId: string) => Promise<void>;
  // ... other existing methods ...
} 