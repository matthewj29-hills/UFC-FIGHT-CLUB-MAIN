export interface EventInput {
  id: string;
  name: string;
  shortName: string;
  date: string;
  venue: {
    name: string;
    city: string;
    country: string;
  };
  fights: FightInput[];
  status: string;
}

export interface FightInput {
  id: string;
  fighter1: FighterBasicInfo;
  fighter2: FighterBasicInfo;
  weightClass: string;
  isMainEvent: boolean;
}

export interface FighterBasicInfo {
  id: string;
  name: string;
  record: string;
}

export interface FighterInput {
  id: string;
  name: string;
  nickname: string;
  height: string;
  weight: string;
  reach: string;
  stance: string;
  record: FighterRecord;
  birthDate: string;
  nationality: string;
  team: string;
  ranking: number | null;
  weightClass: string;
}

export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
}

export interface DivisionRanking {
  weightClass: string;
  champion: FighterInput | null;
  rankings: {
    position: number;
    fighter: FighterInput;
  }[];
} 