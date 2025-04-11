import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation';
import { Prediction, Event, Fight } from '../types/data';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../utils/theme';
import { formatDate } from '../utils/dateUtils';

export const PredictionsScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { user } = useAuth();
  const { getUserPredictions, getEventById, isLoading } = useData();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [events, setEvents] = useState<Record<string, Event>>({});

  useEffect(() => {
    const loadPredictions = async () => {
      if (!user) return;
      const userPredictions = await getUserPredictions(user.uid);
      setPredictions(userPredictions);

      // Load events for predictions
      const eventIds = [...new Set(userPredictions.map(p => p.eventId))];
      const eventsMap: Record<string, Event> = {};
      for (const eventId of eventIds) {
        const event = getEventById(eventId);
        if (event) {
          eventsMap[eventId] = event;
        }
      }
      setEvents(eventsMap);
    };
    loadPredictions();
  }, [user]);

  const getFightFromEvent = (event: Event, fightId: string): Fight | undefined => {
    return event.fights.find(fight => fight.id === fightId);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your predictions</Text>
      </View>
    );
  }

  if (predictions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No predictions yet</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {Object.entries(events).map(([eventId, event]) => {
        const eventPredictions = predictions.filter(p => p.eventId === eventId);
        return (
          <View key={eventId} style={styles.eventSection}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventDate}>{formatDate(new Date(event.date))}</Text>
            
            {eventPredictions.map(prediction => {
              const fight = getFightFromEvent(event, prediction.fightId);
              if (!fight) return null;

              return (
                <View key={prediction.id} style={styles.predictionCard}>
                  <Text style={styles.fightTitle}>Fight {fight.fight_number}</Text>
                  <Text style={styles.weightClass}>{fight.weight_class}</Text>
                  <Text style={styles.prediction}>
                    Predicted: {prediction.winnerId === fight.redCorner.id ? fight.redCorner.name : fight.blueCorner.name}
                  </Text>
                  {prediction.isCorrect !== undefined && (
                    <Text style={[
                      styles.result,
                      prediction.isCorrect ? styles.correct : styles.incorrect
                    ]}>
                      {prediction.isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
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
  message: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  eventSection: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  predictionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  fightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  weightClass: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  prediction: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  result: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  correct: {
    color: colors.success,
  },
  incorrect: {
    color: colors.error,
  },
}); 