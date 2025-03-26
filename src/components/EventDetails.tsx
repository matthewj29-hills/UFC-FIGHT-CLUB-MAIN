import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Event } from '../types/data';
import { formatDate } from '../utils/date';
import { FightOdds } from './FightOdds';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useEvents } from '../hooks/useEvents';

type EventDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventDetails'>;
  route: { params: { eventId: string } };
};

export const EventDetails: React.FC<EventDetailsProps> = ({ navigation, route }) => {
  const { getEventById } = useEvents();
  const event = getEventById(route.params.eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const mainCardFights = event.fights.filter(fight => fight.card === 'main');
  const prelimFights = event.fights.filter(fight => fight.card === 'prelim');

  const handleFighterSelect = (fighterName: string) => {
    navigation.navigate('FighterProfile', { fighterName });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Main Card</Text>
        {mainCardFights.map((fight) => (
          <FightOdds
            key={fight.id}
            fight={fight}
            onSelectFighter={handleFighterSelect}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preliminary Card</Text>
        {prelimFights.map((fight) => (
          <FightOdds
            key={fight.id}
            fight={fight}
            onSelectFighter={handleFighterSelect}
          />
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
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
}); 