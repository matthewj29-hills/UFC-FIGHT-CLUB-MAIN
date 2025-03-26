export interface EventInput {
  name: string;          // e.g., "UFC 300"
  date: string;         // ISO string format
  location: string;     // e.g., "T-Mobile Arena, Las Vegas"
  fights: FightInput[];
}

export interface FightInput {
  fighter1: FighterInput;
  fighter2: FighterInput;
  weightClass: string;
  isMainEvent?: boolean;
  rounds: number;
  order: number;        // Fight order on the card (1 is first fight)
}

export interface FighterInput {
  name: string;
  record: string;      // e.g., "20-3-0"
  rank?: string;       // e.g., "C" for champion, "#1", etc.
  imageUrl?: string;   // Optional fighter image URL
} 