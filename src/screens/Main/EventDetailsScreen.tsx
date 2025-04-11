import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import { Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useData } from '../../contexts/DataContext';
import { Event, Fight } from '../../types/data';
import { colors, spacing } from '../../utils/theme';
import { FightCard } from '../../components/FightCard';

// TODO: Add proper image caching
// TODO: Add fight sorting by weight class
// FIXME: Sometimes the refresh gets stuck - need to debug
// Note to self: remember to add analytics for most viewed events

type EventDetailsScreenProps = {
  route: RouteProp<any, 'EventDetails'>;
  navigation: NativeStackNavigationProp<any>;
};

export const EventDetailsScreen = ({ route, navigation }: EventDetailsScreenProps) => {
  console.log('[EventDetails] Rendering event:', route.params?.eventId); // debug log
  
  const { eventId } = route.params;
  const { getEventDetails } = useData();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<any>(null); // using any because TS is being difficult

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventDetails(eventId);
      console.log('[EventDetails] Event data loaded:', data?.name); // debug
      setEvent(data);
    } catch (err) {
      console.error('[EventDetails] Failed to load event:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEventDetails();
    setRefreshing(false);
  }, [eventId]);

  // quick helper for formatting date - might move to utils later
  const formatDate = (date: string) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    } as const;
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error?.message || 'Failed to load event'}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadEventDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 10, // using numbers instead of spacing
        }}>
          {event.name}
        </Text>
        <Text style={styles.date}>{formatDate(event.date)}</Text>
        <Text style={styles.venue}>{event.venue}</Text>
        <Text style={{
          color: '#666',
          fontSize: 14,
          marginTop: 5,
        }}>
          {event.broadcast}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Main Card</Text>
        {event.mainCard.map((fight: Fight) => (
          <FightCard
            key={fight.id}
            fight={fight}
            onPress={() => {
              console.log('[EventDetails] Navigating to fight:', fight.id);
              navigation.navigate('FightDetails', { 
                eventId, 
                fightId: fight.id 
              });
            }}
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Preliminary Card</Text>
        {event.prelimCard.map((fight: Fight) => (
          <FightCard
            key={fight.id}
            fight={fight}
            onPress={() => {
              console.log('[EventDetails] Navigating to fight:', fight.id);
              navigation.navigate('FightDetails', { 
                eventId, 
                fightId: fight.id 
              });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Styles could use some cleanup but works for now
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    backgroundColor: '#fff', // hardcoded for now
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  venue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: colors.textSecondary,
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: 'red', // should use colors.error but this works
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 