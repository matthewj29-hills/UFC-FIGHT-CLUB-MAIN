import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePredictions } from '../contexts/PredictionContext';
import { useData } from '../contexts/DataContext';
import { Event } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';
import { formatDate } from '../utils/dateUtils';
import { FightCard } from './FightCard';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigation = useNavigation();
  const { makePrediction, isPrelimsLocked, isMainCardLocked, checkCardLockStatus } = usePredictions();
  const { getEventById } = useData();

  useEffect(() => {
    checkCardLockStatus(event.id);
    const interval = setInterval(() => {
      checkCardLockStatus(event.id);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [event.id]);

  const handlePrediction = async (fightId: string, winnerId: string) => {
    try {
      await makePrediction(fightId, winnerId);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  const prelimFights = event.fights.filter(fight => fight.card === 'prelim');
  const mainCardFights = event.fights.filter(fight => fight.card === 'main');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>{formatDate(new Date(event.date))}</Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Card</Text>
          {mainCardFights.map((fight) => (
            <FightCard
              key={fight.id}
              eventId={event.id}
              fight={fight}
              isLocked={isMainCardLocked}
              onPrediction={handlePrediction}
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
              isLocked={isPrelimsLocked}
              onPrediction={handlePrediction}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.medium,
    ...colors.shadow,
  },
  header: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  eventDate: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  eventLocation: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    maxHeight: 600,
  },
  section: {
    padding: spacing.medium,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  footer: {
    padding: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.inverse,
  },
}); 