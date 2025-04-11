import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Event } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';
import { format } from 'date-fns';

export const EventsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual event fetching from Firebase
      // For now, we'll use placeholder data
      const mockEvents: Event[] = [
        {
          id: 'ufc300',
          name: 'UFC 300',
          date: '2024-04-13T23:00:00Z',
          location: 'Las Vegas, Nevada',
          venue: 'T-Mobile Arena',
          status: 'upcoming',
          mainCard: [],
          prelimCard: [],
          broadcast: 'ESPN+ PPV',
        },
        {
          id: 'ufc299',
          name: 'UFC 299',
          date: '2024-03-09T23:00:00Z',
          location: 'Miami, Florida',
          venue: 'Kaseya Center',
          status: 'completed',
          mainCard: [],
          prelimCard: [],
          broadcast: 'ESPN+ PPV',
        },
        // Add more events here
      ];
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: event.status === 'upcoming' ? colors.primary : colors.success }
        ]}>
          <Text style={styles.statusText}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.eventDetails}>
        <Text style={styles.eventDate}>
          {format(new Date(event.date), 'MMM d, yyyy')}
        </Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
        <Text style={styles.eventVenue}>{event.venue}</Text>
        <Text style={styles.eventBroadcast}>{event.broadcast}</Text>
      </View>

      <View style={styles.eventFooter}>
        <Text style={styles.fightCount}>
          {event.mainCard.length + event.prelimCard.length} Fights
        </Text>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>UFC Events</Text>
      </View>

      <View style={styles.eventsContainer}>
        {events.map(renderEventCard)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  eventsContainer: {
    padding: spacing.medium,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  eventName: {
    ...typography.h2,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xsmall,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
  },
  eventDetails: {
    marginBottom: spacing.medium,
  },
  eventDate: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  eventLocation: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  eventVenue: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  eventBroadcast: {
    ...typography.body,
    color: colors.textSecondary,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.small,
  },
  fightCount: {
    ...typography.body,
    color: colors.textSecondary,
  },
  viewDetails: {
    ...typography.body,
    color: colors.primary,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.large,
  },
}); 