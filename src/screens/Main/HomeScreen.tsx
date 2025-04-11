import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation';
import { DataService } from '../services/DataService';
import { Event, UserStats } from '../types/data';
import { colors, spacing, typography } from '../utils';
import { useAuth } from '../contexts/AuthContext';

// TODO: Add pull-to-refresh when backend is ready
// TODO(me): Remember to add caching for events data
// FIXME: Sometimes events don't load on first try - might be race condition

const HomeScreen: React.FC = () => {
  console.log('[HomeScreen] Rendering...'); // left this in for perf debugging
  const navigation = useNavigation<MainTabNavigationProp>();
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [events, stats] = await Promise.all([
        DataService.getInstance().getUpcomingEvents(),
        user ? DataService.getInstance().getUserStats(user.uid) : null,
      ]);
      console.log('[HomeScreen] Events loaded:', events?.length); // debugging
      setUpcomingEvents(events || []);
      setUserStats(stats);
    } catch (err) {
      console.error('[HomeScreen] Failed to load events:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, { elevation: 3 }]} // android shadow
      onPress={() => {
        console.log('[HomeScreen] Navigating to event:', event.id);
        navigation.navigate('EventDetails', { eventId: event.id });
      }}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatsOverview = () => {
    if (!user) return null;
    if (!userStats) return null;

    const accuracy = userStats.totalPredictions > 0
      ? ((userStats.correctPredictions / userStats.totalPredictions) * 100).toFixed(1)
      : '0.0';

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.totalPredictions}</Text>
            <Text style={styles.statLabel}>Predictions</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>

          {userStats.rank && (
            <View style={styles.statCard}>
              <Text style={styles.statValue}>#{userStats.rank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
        </Text>
      </View>

      {renderStatsOverview()}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FightCard')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : error ? (
          <Text style={styles.errorText}>
            {error?.message || 'Something went wrong'}
          </Text>
        ) : upcomingEvents.length === 0 ? (
          <Text style={styles.noEventsText}>No upcoming events found</Text>
        ) : (
          upcomingEvents.slice(0, 3).map(renderEventCard)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.text.inverse,
  },
  statsContainer: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.md,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  viewAll: {
    ...typography.button,
    color: colors.primary,
  },
  eventCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventInfo: {
    padding: spacing.md,
  },
  eventName: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventDate: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  eventLocation: {
    ...typography.body2,
    color: colors.text.secondary,
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
  noEventsText: {
    textAlign: 'center',
    padding: 20,
    color: colors.textSecondary,
  },
});

export default HomeScreen; 