import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { DataService } from '../services';
import { colors, spacing, typography } from '../utils';
import { UserStats } from '../types/data';
import { useAuth } from '../contexts/AuthContext';

const StatsScreen: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const userStats = await DataService.getInstance().getUserStats(user.uid);
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your stats</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading stats...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No stats available</Text>
      </View>
    );
  }

  const accuracy = stats.totalPredictions > 0
    ? ((stats.correctPredictions / stats.totalPredictions) * 100).toFixed(1)
    : '0.0';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.username}>{user.displayName || 'Fighter'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.points}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPredictions}</Text>
          <Text style={styles.statLabel}>Predictions</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.correctPredictions}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {stats.rank && (
        <View style={styles.rankContainer}>
          <Text style={styles.rankLabel}>Current Rank</Text>
          <Text style={styles.rankValue}>#{stats.rank}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing.md,
  },
  message: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  username: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  rankContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  rankLabel: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  rankValue: {
    ...typography.h1,
    color: colors.primary,
  },
});

export default StatsScreen; 