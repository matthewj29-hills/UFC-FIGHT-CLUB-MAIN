import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp } from '../../types/navigation';
import DataService from '../../services/DataService';
import { LeaderboardEntry } from '../../types/data';

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      const data = await DataService.getInstance().getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const getRankColor = (rank: number) => {
      switch (rank) {
        case 1:
          return '#FFD700'; // Gold
        case 2:
          return '#C0C0C0'; // Silver
        case 3:
          return '#CD7F32'; // Bronze
        default:
          return '#666';
      }
    };

    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          <View
            style={[
              styles.rankBadge,
              { backgroundColor: getRankColor(index + 1) },
            ]}
          >
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.stats}>
            {item.totalPredictions} predictions • {item.accuracy}% accuracy
          </Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{item.points}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Global Leaderboard</Text>
      </View>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    padding: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  stats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default LeaderboardScreen; 