import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp } from '../../types/navigation';
import DataService from '../../services/DataService';
import { UserStats } from '../../types/data';

const StatsScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const userStats = await DataService.getInstance().getUserStats('current_user');
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const renderStatCard = (title: string, value: string | number) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderMethodAccuracy = () => {
    if (!stats) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Method Accuracy</Text>
        <View style={styles.methodGrid}>
          {Object.entries(stats.methodAccuracy).map(([method, accuracy]) => (
            <View key={method} style={styles.methodCard}>
              <Text style={styles.methodTitle}>{method}</Text>
              <Text style={styles.methodValue}>{accuracy}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRoundAccuracy = () => {
    if (!stats) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Round Accuracy</Text>
        <View style={styles.roundGrid}>
          {Object.entries(stats.roundAccuracy).map(([round, accuracy]) => (
            <View key={round} style={styles.roundCard}>
              <Text style={styles.roundTitle}>Round {round}</Text>
              <Text style={styles.roundValue}>{accuracy}%</Text>
            </View>
          ))}
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

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load statistics</Text>
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
        <Text style={styles.title}>My Statistics</Text>
      </View>

      <View style={styles.statsGrid}>
        {renderStatCard('Total Predictions', stats.totalPredictions)}
        {renderStatCard('Correct Predictions', stats.correctPredictions)}
        {renderStatCard('Accuracy', `${stats.accuracy}%`)}
        {renderStatCard('Current Streak', stats.currentStreak)}
        {renderStatCard('Best Streak', stats.bestStreak)}
      </View>

      {renderMethodAccuracy()}
      {renderRoundAccuracy()}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: '31%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  methodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  roundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roundCard: {
    width: '18%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  roundTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  roundValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default StatsScreen; 