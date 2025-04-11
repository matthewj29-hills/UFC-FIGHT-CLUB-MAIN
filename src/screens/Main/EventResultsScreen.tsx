import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../utils/theme';
import { Event, Fight } from '../../types/data';
import { RootStackParamList } from '../../navigation/AppNavigator';

type EventResultsScreenProps = {
  route: RouteProp<RootStackParamList, 'EventResults'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventResults'>;
};

export const EventResultsScreen: React.FC<EventResultsScreenProps> = ({
  route,
  navigation,
}) => {
  const { eventId } = route.params;
  const { getEventDetails, updateFightResult } = useData();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await getEventDetails(eventId);
      if (eventData) {
        setEvent(eventData);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = async (fight: Fight, winner: string, method: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update results');
      return;
    }

    try {
      await updateFightResult(eventId, fight.id, {
        winner,
        method,
        round: 1,
        time: '5:00'
      });
      Alert.alert('Success', 'Fight result has been updated!');
      loadEventDetails();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update fight result');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Event not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.date}>
          {new Date(event.date).toLocaleDateString()} at {event.location}
        </Text>
      </View>

      <View style={styles.fightsContainer}>
        <Text style={styles.sectionTitle}>Main Card</Text>
        {event.mainCard.map((fight, index) => (
          <View key={fight.id} style={styles.fightCard}>
            <Text style={styles.weightClass}>{fight.weightClass}</Text>
            <View style={styles.fightersContainer}>
              <TouchableOpacity
                style={[
                  styles.fighterButton,
                  fight.winner === fight.fighter1Id && styles.winnerButton,
                ]}
                onPress={() => handleUpdateResult(fight, fight.fighter1Id, 'KO')}
              >
                <Text style={styles.fighterName}>{fight.fighter1Id}</Text>
                {fight.winner === fight.fighter1Id && (
                  <Text style={styles.winnerText}>Winner</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.vs}>VS</Text>

              <TouchableOpacity
                style={[
                  styles.fighterButton,
                  fight.winner === fight.fighter2Id && styles.winnerButton,
                ]}
                onPress={() => handleUpdateResult(fight, fight.fighter2Id, 'KO')}
              >
                <Text style={styles.fighterName}>{fight.fighter2Id}</Text>
                {fight.winner === fight.fighter2Id && (
                  <Text style={styles.winnerText}>Winner</Text>
                )}
              </TouchableOpacity>
            </View>
            {fight.winner && (
              <Text style={styles.resultText}>
                Winner: {fight.winner} by {fight.method}
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Preliminary Card</Text>
        {event.prelimCard.map((fight, index) => (
          <View key={fight.id} style={styles.fightCard}>
            <Text style={styles.weightClass}>{fight.weightClass}</Text>
            <View style={styles.fightersContainer}>
              <TouchableOpacity
                style={[
                  styles.fighterButton,
                  fight.winner === fight.fighter1Id && styles.winnerButton,
                ]}
                onPress={() => handleUpdateResult(fight, fight.fighter1Id, 'KO')}
              >
                <Text style={styles.fighterName}>{fight.fighter1Id}</Text>
                {fight.winner === fight.fighter1Id && (
                  <Text style={styles.winnerText}>Winner</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.vs}>VS</Text>

              <TouchableOpacity
                style={[
                  styles.fighterButton,
                  fight.winner === fight.fighter2Id && styles.winnerButton,
                ]}
                onPress={() => handleUpdateResult(fight, fight.fighter2Id, 'KO')}
              >
                <Text style={styles.fighterName}>{fight.fighter2Id}</Text>
                {fight.winner === fight.fighter2Id && (
                  <Text style={styles.winnerText}>Winner</Text>
                )}
              </TouchableOpacity>
            </View>
            {fight.winner && (
              <Text style={styles.resultText}>
                Winner: {fight.winner} by {fight.method}
              </Text>
            )}
          </View>
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
  header: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.small,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  fightsContainer: {
    padding: spacing.medium,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
    marginTop: spacing.large,
  },
  fightCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  weightClass: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.small,
  },
  fightersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fighterButton: {
    flex: 1,
    padding: spacing.medium,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  winnerButton: {
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
  },
  fighterName: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  vs: {
    ...typography.body,
    color: colors.textSecondary,
    marginHorizontal: spacing.medium,
  },
  winnerText: {
    ...typography.body,
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing.small,
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.medium,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    padding: spacing.medium,
  },
}); 