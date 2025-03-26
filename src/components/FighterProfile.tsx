import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { Fighter } from '../types/data';
import { formatDate } from '../utils/date';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type FighterProfileProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FighterProfile'>;
  route: { params: { fighterName: string } };
};

const FightHistoryRow: React.FC<{ fight: Fighter['recentFights'][0] }> = ({ fight }) => (
  <View style={styles.fightHistoryRow}>
    <Text style={styles.fightDate}>{formatDate(fight.date)}</Text>
    <View style={styles.fightResult}>
      <Text style={[
        styles.resultText,
        fight.result === 'W' ? styles.winText :
        fight.result === 'L' ? styles.lossText :
        styles.drawText
      ]}>
        {fight.result}
      </Text>
      <Text style={styles.opponentText}>{fight.opponent}</Text>
    </View>
    <Text style={styles.fightMethod}>{fight.method}</Text>
    <Text style={styles.fightRound}>R{fight.round}</Text>
    <Text style={styles.fightTime}>{fight.time}</Text>
  </View>
);

export const FighterProfile: React.FC<FighterProfileProps> = ({ navigation, route }) => {
  const { getFighterUpcomingFights, getFighterPastFights } = useEvents();
  const fighterName = route.params.fighterName;

  // In a real app, we would fetch the fighter data from an API or database
  // For now, we'll use mock data
  const fighter: Fighter = {
    id: '1',
    name: fighterName,
    record: '20-3-0',
    style: 'Striker',
    height: "5'11\"",
    weight: 170,
    weight_class: 'Lightweight',
    rank: 5,
    imageUrl: 'https://example.com/fighter.jpg',
    recentFights: [
      {
        date: '2024-02-10',
        opponent: 'John Doe',
        result: 'W',
        method: 'KO',
        round: 2,
        time: '3:45'
      }
    ],
    odds: []
  };

  const upcomingFights = getFighterUpcomingFights(fighterName);
  const pastFights = getFighterPastFights(fighterName);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: fighter.imageUrl }}
          style={styles.fighterImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.fighterName}>{fighter.name}</Text>
          <Text style={styles.fighterRecord}>{fighter.record}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fighter Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Style</Text>
            <Text style={styles.detailValue}>{fighter.style}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Height</Text>
            <Text style={styles.detailValue}>{fighter.height}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{fighter.weight} lbs</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Division</Text>
            <Text style={styles.detailValue}>{fighter.weight_class}</Text>
          </View>
          {fighter.rank && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rank</Text>
              <Text style={styles.detailValue}>#{fighter.rank}</Text>
            </View>
          )}
        </View>
      </View>

      {upcomingFights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Fights</Text>
          {upcomingFights.map((fight) => (
            <View key={fight.id} style={styles.upcomingFight}>
              <Text style={styles.fightDate}>{formatDate(fight.eventId)}</Text>
              <Text style={styles.opponentText}>
                vs {fight.redCorner.name === fighter.name ? fight.blueCorner.name : fight.redCorner.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Fights</Text>
        {fighter.recentFights.map((fight, index) => (
          <FightHistoryRow key={index} fight={fight} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  fighterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  fighterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fighterRecord: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  fightHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fightDate: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  fightResult: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  winText: {
    color: '#4CAF50',
  },
  lossText: {
    color: '#F44336',
  },
  drawText: {
    color: '#FFC107',
  },
  opponentText: {
    fontSize: 16,
    flex: 1,
  },
  fightMethod: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  fightRound: {
    fontSize: 14,
    color: '#666',
    width: 40,
  },
  fightTime: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  upcomingFight: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
}); 