import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Fight } from '../types/data';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useEvents } from '../hooks/useEvents';

type FightOddsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FightDetails'>;
  route: { params: { fightId: string } };
};

export const FightOdds: React.FC<FightOddsProps> = ({ navigation, route }) => {
  const { getFightById } = useEvents();
  const fight = getFightById(route.params.fightId);

  if (!fight) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Fight not found</Text>
      </View>
    );
  }

  const formatOdds = (odds: number) => {
    if (odds >= 0) return `+${odds}`;
    return odds.toString();
  };

  const getOddsColor = (odds: number) => {
    if (odds >= 0) return '#4CAF50';
    return '#F44336';
  };

  const handleFighterSelect = (fighterName: string) => {
    navigation.navigate('FighterProfile', { fighterName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.weightClass}>{fight.weight_class}</Text>
        <Text style={styles.fightNumber}>Fight #{fight.fight_number}</Text>
      </View>

      <View style={styles.fightersContainer}>
        <TouchableOpacity
          style={styles.fighterCard}
          onPress={() => handleFighterSelect(fight.redCorner.name)}
        >
          <Text style={styles.fighterName}>{fight.redCorner.name}</Text>
          <Text style={styles.fighterRecord}>{fight.redCorner.record}</Text>
          <View style={styles.oddsContainer}>
            {fight.redCorner.odds.map((odds, index) => (
              <View key={index} style={styles.oddsItem}>
                <Text style={styles.sportsbook}>{odds.sportsbook}</Text>
                <Text style={[styles.odds, { color: getOddsColor(odds.value) }]}>
                  {formatOdds(odds.value)}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <TouchableOpacity
          style={styles.fighterCard}
          onPress={() => handleFighterSelect(fight.blueCorner.name)}
        >
          <Text style={styles.fighterName}>{fight.blueCorner.name}</Text>
          <Text style={styles.fighterRecord}>{fight.blueCorner.record}</Text>
          <View style={styles.oddsContainer}>
            {fight.blueCorner.odds.map((odds, index) => (
              <View key={index} style={styles.oddsItem}>
                <Text style={styles.sportsbook}>{odds.sportsbook}</Text>
                <Text style={[styles.odds, { color: getOddsColor(odds.value) }]}>
                  {formatOdds(odds.value)}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightClass: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fightNumber: {
    fontSize: 14,
    color: '#666',
  },
  fightersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fighterCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  fighterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fighterRecord: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  oddsContainer: {
    width: '100%',
  },
  oddsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sportsbook: {
    fontSize: 12,
    color: '#666',
  },
  odds: {
    fontSize: 14,
    fontWeight: '500',
  },
  vsContainer: {
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
  },
}); 