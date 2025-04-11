import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { UserStats, Prediction } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';
import { format } from 'date-fns';
import { mockUserStats } from '../services/mockData';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual user stats fetching from Firebase
      // For now, we'll use mock data
      const mockStats = mockUserStats[user?.uid || 'user1'];
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load user stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      Alert.alert('Error', 'Failed to sign out');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Failed to load profile'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.accuracy.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {stats.lastThreePredictions.map((prediction, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>
                  {prediction.selectedFighter}
                </Text>
                <Text style={[
                  styles.activityStatus,
                  { color: prediction.isCorrect ? colors.success : colors.error }
                ]}>
                  {prediction.isCorrect ? 'Correct' : 'Incorrect'}
                </Text>
              </View>
              <Text style={styles.activityDetails}>
                {format(new Date(prediction.timestamp), 'MMM d, yyyy')} • {prediction.confidence}% confidence
              </Text>
              <Text style={styles.activityPoints}>
                {prediction.points || 0} points
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.performanceStats}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Total Predictions</Text>
            <Text style={styles.performanceValue}>{stats.totalPredictions}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Correct Predictions</Text>
            <Text style={styles.performanceValue}>{stats.correctPredictions}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Favorite Weight Class</Text>
            <Text style={styles.performanceValue}>{stats.favoriteWeightClass}</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Best Performing Weight Class</Text>
            <Text style={styles.performanceValue}>{stats.bestPerformingWeightClass}</Text>
          </View>
        </View>
      </View>

      {stats.biggestUpset && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biggest Upset</Text>
          <View style={styles.upsetCard}>
            <Text style={styles.upsetTitle}>+{stats.biggestUpset.odds}</Text>
            <Text style={styles.upsetPoints}>{stats.biggestUpset.points} points</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  signOutButton: {
    padding: spacing.small,
  },
  signOutText: {
    ...typography.body,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.medium,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  activityList: {
    gap: spacing.medium,
  },
  activityItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xsmall,
  },
  activityTitle: {
    ...typography.h3,
    color: colors.text,
  },
  activityStatus: {
    ...typography.body,
  },
  activityDetails: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  activityPoints: {
    ...typography.body,
    color: colors.primary,
  },
  performanceStats: {
    gap: spacing.medium,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
  },
  performanceLabel: {
    ...typography.body,
    color: colors.text,
  },
  performanceValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  upsetCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    alignItems: 'center',
  },
  upsetTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xsmall,
  },
  upsetPoints: {
    ...typography.body,
    color: colors.text,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.large,
  },
}); 