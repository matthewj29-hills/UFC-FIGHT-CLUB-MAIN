import axios from 'axios';
import { EventInput, FightInput, FighterInput } from './types';

interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  winsByKO: number;
  winsBySub: number;
  winsByDec: number;
}

interface FighterDetails {
  name: string;
  record: FighterRecord;
  division: string;
  rank?: string;
  imageUrl?: string;
  nickname?: string;
  age?: number;
  height?: string;
  weight?: string;
  reach?: string;
  stance?: string;
  pastFights: Array<{
    opponent: string;
    result: 'W' | 'L' | 'D' | 'NC';
    method: string;
    round: number;
    time: string;
    event: string;
    date: string;
  }>;
}

interface EventDetails {
  id: string;
  name: string;
  date: string;
  location: string;
  venue: string;
  isNumbered: boolean;
  fights: Array<{
    fighter1: FighterDetails;
    fighter2: FighterDetails;
    weightClass: string;
    isMainEvent: boolean;
    isCoMain: boolean;
    rounds: number;
    order: number;
    odds?: {
      fighter1: number;
      fighter2: number;
      lastUpdated: string;
    };
  }>;
}

export class UFCDataGatherer {
  private readonly baseUrls = {
    events: 'https://api.espn.com/v3/sports/mma/ufc/events',
    eventDetails: 'https://api.espn.com/v3/sports/mma/ufc/events/',
    fighter: 'https://api.espn.com/v3/sports/mma/athletes/',
    rankings: 'https://api.espn.com/v3/sports/mma/ufc/rankings'
  };

  private readonly apiKey = 'YOUR_ESPN_API_KEY'; // You'll need to register for an ESPN API key

  async gatherRecentAndUpcomingEvents(upcomingCount: number, recentCount: number): Promise<EventInput[]> {
    try {
      const response = await axios.get(`${this.baseUrls.events}`, {
        params: {
          limit: upcomingCount + recentCount,
          apikey: this.apiKey
        }
      });

      return this.processEventsResponse(response.data, upcomingCount, recentCount);
    } catch (error) {
      console.error('Error gathering event data:', error);
      return [];
    }
  }

  private processEventsResponse(data: any, upcomingCount: number, recentCount: number): EventInput[] {
    const events = data.events || [];
    const now = new Date();
    
    const sortedEvents = events.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const upcomingEvents = sortedEvents
      .filter((event: any) => new Date(event.date) >= now)
      .slice(0, upcomingCount);

    const recentEvents = sortedEvents
      .filter((event: any) => new Date(event.date) < now)
      .slice(-recentCount);

    return [...recentEvents, ...upcomingEvents].map(this.convertToEventInput);
  }

  private convertToEventInput(event: any): EventInput {
    return {
      id: event.id,
      name: event.name,
      shortName: event.shortName,
      date: new Date(event.date).toISOString(),
      venue: {
        name: event.venue?.name || '',
        city: event.venue?.address?.city || '',
        country: event.venue?.address?.country || '',
      },
      fights: event.competitions?.[0]?.competitors?.map((competitor: any) => ({
        id: competitor.id,
        fighter1: {
          id: competitor.athlete?.id || '',
          name: competitor.athlete?.displayName || '',
          record: competitor.athlete?.record || '',
        },
        fighter2: {
          id: competitor.opponent?.id || '',
          name: competitor.opponent?.displayName || '',
          record: competitor.opponent?.record || '',
        },
        weightClass: competitor.weightClass || '',
        isMainEvent: competitor.isMainEvent || false,
      })) || [],
      status: event.status?.type?.name || 'SCHEDULED',
    };
  }

  async getEventDetails(eventId: string): Promise<EventInput | null> {
    try {
      const response = await axios.get(`${this.baseUrls.eventDetails}${eventId}`, {
        params: {
          apikey: this.apiKey
        }
      });
      return this.processEventDetailsResponse(response.data);
    } catch (error) {
      console.error(`Error gathering details for event ${eventId}:`, error);
      return null;
    }
  }

  private processEventDetailsResponse(data: any): EventInput | null {
    if (!data) return null;
    return this.convertToEventInput(data);
  }

  async getFighterDetails(fighterId: string): Promise<FighterInput | null> {
    try {
      const response = await axios.get(`${this.baseUrls.fighter}${fighterId}`, {
        params: {
          apikey: this.apiKey
        }
      });
      return this.processFighterData(response.data);
    } catch (error) {
      console.error(`Error gathering details for fighter ${fighterId}:`, error);
      return null;
    }
  }

  private processFighterData(data: any): FighterInput | null {
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.displayName,
      nickname: data.nickname || '',
      height: data.height || '',
      weight: data.weight || '',
      reach: data.reach || '',
      stance: data.stance || '',
      record: {
        wins: data.statistics?.wins || 0,
        losses: data.statistics?.losses || 0,
        draws: data.statistics?.draws || 0,
        noContests: data.statistics?.noContests || 0,
      },
      birthDate: data.birthDate || '',
      nationality: data.nationality || '',
      team: data.team?.name || '',
      ranking: data.ranking || null,
      weightClass: data.weightClass || '',
    };
  }

  async getDivisionRankings(): Promise<any[]> {
    try {
      const response = await axios.get(this.baseUrls.rankings, {
        params: {
          apikey: this.apiKey
        }
      });
      return this.processRankingsData(response.data);
    } catch (error) {
      console.error('Error gathering rankings data:', error);
      return [];
    }
  }

  private processRankingsData(data: any): any[] {
    if (!data || !data.rankings) return [];
    
    return data.rankings.map((division: any) => ({
      weightClass: division.weightClass,
      champion: this.processFighterData(division.champion),
      rankings: division.rankings.map((rank: any) => ({
        position: rank.position,
        fighter: this.processFighterData(rank.athlete),
      })),
    }));
  }
}

export default UFCDataGatherer; 