import { useState, useEffect } from 'react';
import { Event, Fight, ComingSoonEvent } from '../types/data';
import { EventService } from '../services/EventService';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [comingSoonEvents, setComingSoonEvents] = useState<ComingSoonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const eventService = EventService.getInstance();

  useEffect(() => {
    try {
      setEvents(eventService.getEvents());
      setComingSoonEvents(eventService.getComingSoonEvents());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventById = (id: string) => {
    return eventService.getEventById(id);
  };

  const getEventFights = (eventId: string) => {
    return eventService.getEventFights(eventId);
  };

  const getMainCardFights = (eventId: string) => {
    return eventService.getMainCardFights(eventId);
  };

  const getPrelimFights = (eventId: string) => {
    return eventService.getPrelimFights(eventId);
  };

  const getFightById = (fightId: string) => {
    return eventService.getFightById(fightId);
  };

  const getUpcomingEvents = () => {
    return eventService.getUpcomingEvents();
  };

  const getPastEvents = () => {
    return eventService.getPastEvents();
  };

  const getLiveEvents = () => {
    return eventService.getLiveEvents();
  };

  const getFighterUpcomingFights = (fighterName: string) => {
    return eventService.getFighterUpcomingFights(fighterName);
  };

  const getFighterPastFights = (fighterName: string) => {
    return eventService.getFighterPastFights(fighterName);
  };

  const updateFightResult = (fightId: string, result: Fight['result']) => {
    eventService.updateFightResult(fightId, result);
    // Refresh events after update
    setEvents(eventService.getEvents());
  };

  return {
    events,
    comingSoonEvents,
    loading,
    error,
    getEventById,
    getEventFights,
    getMainCardFights,
    getPrelimFights,
    getFightById,
    getUpcomingEvents,
    getPastEvents,
    getLiveEvents,
    getFighterUpcomingFights,
    getFighterPastFights,
    updateFightResult
  };
} 