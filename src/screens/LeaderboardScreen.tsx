import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { DataService } from '../services/DataService';
import { colors, spacing, typography } from '../utils';
import { LeaderboardEntry } from '../types/data';
import { useAuth } from '../contexts/AuthContext';

const LeaderboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const data = await DataService.getInstance().getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrentUser = user && item.userId === user.uid;
    const position = index + 1;
    let medal = null;

    if (position === 1) {
      medal = '🥇';
    } else if (position === 2) {
      medal = '🥈';
    } else if (position === 3) {
      medal = '🥉';
    }

    return (
      <TouchableOpacity
        style={[
          styles.row,
          isCurrentUser && styles.currentUserRow,
        ]}
      >
        <View style={styles.rankContainer}>
          {medal ? (
            <Text style={styles.medal}>{medal}</Text>
          ) : (
            <Text style={styles.rank}>#{position}</Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text
            style={[
              styles.username,
              isCurrentUser && styles.currentUserText,
            ]}
            numberOfLines={1}
          >
            {item.username}
          </Text>
          <Text style={styles.stats}>
            {item.totalPredictions} predictions • {item.accuracy.toFixed(1)}% accuracy
          </Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text
            style={[
              styles.points,
              isCurrentUser && styles.currentUserText,
            ]}
          >
            {item.points}
          </Text>
          <Text style={styles.pointsLabel}>PTS</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={leaderboard}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.title}>Global Leaderboard</Text>
          <Text style={styles.subtitle}>Top 50 Predictors</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.message}>No rankings available</Text>
      )}
      contentContainerStyle={styles.contentContainer}
    />
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
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  message: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  currentUserRow: {
    backgroundColor: colors.primary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    ...typography.subtitle2,
    color: colors.text.secondary,
  },
  medal: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  stats: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  pointsContainer: {
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  points: {
    ...typography.h3,
    color: colors.text.primary,
  },
  pointsLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  currentUserText: {
    color: colors.text.inverse,
  },
});

export default LeaderboardScreen; 