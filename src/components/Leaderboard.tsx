import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardEntry } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';

type LeaderboardType = 'personal' | 'friends' | 'global';

export const Leaderboard: React.FC = () => {
  const { getLeaderboard, getUserStats } = useData();
  const { user } = useAuth();
  const [type, setType] = useState<LeaderboardType>('personal');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [type]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (type === 'personal' && user) {
        const stats = await getUserStats(user.uid);
        setEntries([{
          userId: user.uid,
          username: user.displayName || 'Anonymous',
          points: stats.points,
          accuracy: stats.accuracy,
          totalPredictions: stats.totalPredictions,
          currentStreak: stats.currentStreak
        }]);
      } else {
        const leaderboard = await getLeaderboard();
        if (type === 'friends' && user) {
          // Filter for friends (users you've interacted with)
          const friends = leaderboard.filter(entry => 
            entry.userId !== user.uid && 
            entry.totalPredictions > 0
          ).slice(0, 10);
          setEntries(friends);
        } else {
          setEntries(leaderboard.slice(0, 100));
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEntry = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <View style={styles.entry}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.stats}>
          {item.totalPredictions} fights • {item.accuracy.toFixed(1)}% accuracy
        </Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{item.points}</Text>
        <Text style={styles.streak}>🔥 {item.currentStreak}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.typeSelector}>
          {(['personal', 'friends', 'global'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.selectedType]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.selectedTypeText]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={item => item.userId}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  typeButton: {
    padding: spacing.small,
    borderRadius: 8,
    backgroundColor: colors.surface,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: colors.primary,
  },
  typeText: {
    ...typography.body,
    color: colors.text,
  },
  selectedTypeText: {
    color: colors.white,
  },
  list: {
    padding: spacing.medium,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.small,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.medium,
  },
  rank: {
    ...typography.h4,
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },
  stats: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    ...typography.h4,
    color: colors.primary,
  },
  streak: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
}); 