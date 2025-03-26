import { Event, Fight, Fighter, ComingSoonEvent } from '../types/data';
import { currentEvents, comingSoonEvents, updateEvents, addComingSoonEvent, convertToFullEvent } from '../data/events';

export class EventService {
  private static instance: EventService;
  private events: Event[] = currentEvents;
  private upcomingEvents: ComingSoonEvent[] = comingSoonEvents;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  // Get all current events
  public getEvents(): Event[] {
    return this.events;
  }

  // Get upcoming events that are coming soon
  public getComingSoonEvents(): ComingSoonEvent[] {
    return this.upcomingEvents;
  }

  // Get a specific event by ID
  public getEventById(id: string): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  // Get all fights for a specific event
  public getEventFights(eventId: string): Fight[] {
    const event = this.getEventById(eventId);
    return event?.fights || [];
  }

  // Get main card fights for a specific event
  public getMainCardFights(eventId: string): Fight[] {
    return this.getEventFights(eventId).filter(fight => fight.card === 'main');
  }

  // Get preliminary card fights for a specific event
  public getPrelimFights(eventId: string): Fight[] {
    return this.getEventFights(eventId).filter(fight => fight.card === 'prelim');
  }

  // Get a specific fight by ID
  public getFightById(fightId: string): Fight | undefined {
    for (const event of this.events) {
      const fight = event.fights.find(f => f.id === fightId);
      if (fight) return fight;
    }
    return undefined;
  }

  // Update events with new data
  public updateEvents(newEvents: Event[]): void {
    this.events = newEvents;
    updateEvents(newEvents);
  }

  // Add a new coming soon event
  public addComingSoonEvent(event: ComingSoonEvent): void {
    this.upcomingEvents.push(event);
    addComingSoonEvent(event);
  }

  // Convert a coming soon event to a full event
  public convertToFullEvent(comingSoonId: string, fights: Fight[]): Event {
    const comingSoon = this.upcomingEvents.find(e => e.id === comingSoonId);
    if (!comingSoon) {
      throw new Error(`Coming soon event with ID ${comingSoonId} not found`);
    }

    const fullEvent = convertToFullEvent(comingSoon, fights);
    this.events.push(fullEvent);
    this.upcomingEvents = this.upcomingEvents.filter(e => e.id !== comingSoonId);
    return fullEvent;
  }

  // Get events by status
  public getEventsByStatus(status: Event['status']): Event[] {
    return this.events.filter(event => event.status === status);
  }

  // Get upcoming events (including coming soon)
  public getUpcomingEvents(): (Event | ComingSoonEvent)[] {
    return [
      ...this.events.filter(event => event.status === 'upcoming'),
      ...this.upcomingEvents
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Get past events
  public getPastEvents(): Event[] {
    return this.events
      .filter(event => event.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get live events
  public getLiveEvents(): Event[] {
    return this.events.filter(event => event.status === 'live');
  }

  // Update fight result
  public updateFightResult(fightId: string, result: Fight['result']): void {
    for (const event of this.events) {
      const fight = event.fights.find(f => f.id === fightId);
      if (fight) {
        fight.result = result;
        break;
      }
    }
  }

  // Get fighter's upcoming fights
  public getFighterUpcomingFights(fighterName: string): Fight[] {
    return this.events
      .filter(event => event.status === 'upcoming')
      .flatMap(event => event.fights)
      .filter(fight => 
        fight.redCorner.name === fighterName || 
        fight.blueCorner.name === fighterName
      );
  }

  // Get fighter's past fights
  public getFighterPastFights(fighterName: string): Fight[] {
    return this.events
      .filter(event => event.status === 'completed')
      .flatMap(event => event.fights)
      .filter(fight => 
        fight.redCorner.name === fighterName || 
        fight.blueCorner.name === fighterName
      );
  }
} 