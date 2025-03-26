import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { Event, ComingSoonEvent } from '../types/data';
import { formatDate } from '../utils/date';

const EventCard: React.FC<{ event: Event; onPress: () => void }> = ({ event, onPress }) => (
  <TouchableOpacity style={styles.eventCard} onPress={onPress}>
    <Text style={styles.eventName}>{event.name}</Text>
    <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
    <Text style={styles.eventLocation}>{event.location}</Text>
    <Text style={styles.fightCount}>{event.fights.length} fights</Text>
  </TouchableOpacity>
);

const ComingSoonCard: React.FC<{ event: ComingSoonEvent }> = ({ event }) => (
  <View style={[styles.eventCard, styles.comingSoonCard]}>
    <Text style={styles.eventName}>{event.name}</Text>
    <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
    <Text style={styles.comingSoonText}>Coming Soon</Text>
    <Text style={styles.fightCount}>{event.fights} fights expected</Text>
  </View>
);

export const EventsList: React.FC = () => {
  const { events, comingSoonEvents, loading, error, getUpcomingEvents } = useEvents();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading events: {error.message}</Text>
      </View>
    );
  }

  const upcomingEvents = getUpcomingEvents();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if ('status' in item && item.status === 'coming_soon') {
            return <ComingSoonCard event={item as ComingSoonEvent} />;
          }
          return (
            <EventCard
              event={item as Event}
              onPress={() => {
                // Handle event press
              }}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonCard: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  fightCount: {
    fontSize: 14,
    color: '#666',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
}); 