import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Event, Fight } from '../types/data';
import { EventCard } from '../components/EventCard';
import { FightCard } from '../components/FightCard';
import { useData } from '../contexts/DataContext';
import { colors, spacing } from '../utils/theme';
import { formatDate } from '../utils/dateUtils';

type EventDetailsScreenRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

export const EventDetailsScreen: React.FC = () => {
  const route = useRoute<EventDetailsScreenRouteProp>();
  const { getEventById, isLoading } = useData();
  const [event, setEvent] = useState<Event | undefined>();
  const [mainCardFights, setMainCardFights] = useState<Fight[]>([]);
  const [prelimFights, setPrelimFights] = useState<Fight[]>([]);

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = getEventById(route.params.eventId);
      if (eventData) {
        setEvent(eventData);
        setMainCardFights(eventData.fights.filter(fight => fight.fight_number <= 5));
        setPrelimFights(eventData.fights.filter(fight => fight.fight_number > 5));
      }
    };
    loadEvent();
  }, [route.params.eventId]);

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <EventCard event={event} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Main Card</Text>
        {mainCardFights.map((fight) => (
          <FightCard
            key={fight.id}
            eventId={event.id}
            fight={fight}
            isLocked={false}
            onPrediction={() => {}}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preliminary Card</Text>
        {prelimFights.map((fight) => (
          <FightCard
            key={fight.id}
            eventId={event.id}
            fight={fight}
            isLocked={false}
            onPrediction={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
}); 