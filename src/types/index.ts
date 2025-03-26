export interface User {
  id: string;
  email: string;
  displayName: string;
  predictions: number;
  correctPredictions: number;
  createdAt: string;
}

export interface Fight {
  id: string;
  event: string;
  date: string;
  fighter1: Fighter;
  fighter2: Fighter;
  weightClass: string;
  rounds: number;
  isMain: boolean;
  odds?: {
    fighter1: number;
    fighter2: number;
    lastUpdated: string;
  };
}

export interface Fighter {
  id: string;
  name: string;
  record: string;
  imageUrl?: string;
  stats?: FighterStats;
}

export interface FighterStats {
  wins: number;
  losses: number;
  draws: number;
  knockouts: number;
  submissions: number;
  strikingAccuracy: number;
  takedownAccuracy: number;
  height: number; // in inches
  weight: number; // in pounds
  reach: number; // in inches
  stance: 'Orthodox' | 'Southpaw' | 'Switch';
}

export interface Prediction {
  id: string;
  userId: string;
  fightId: string;
  selectedFighterId: string;
  method: 'KO/TKO' | 'Submission' | 'Decision';
  round?: number;
  createdAt: string;
  isCorrect?: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  fights: Fight[];
  poster?: string;
}

export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  predictions: number;
  correctPredictions: number;
  accuracy: number;
  points: number;
} 