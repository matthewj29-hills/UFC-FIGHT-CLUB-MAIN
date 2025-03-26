import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Event, Fight, Fighter } from '../types/data';
import { formatDate } from '../utils/date';
import { colors, spacing, typography } from '../utils/theme';

interface FightCardProps {
  eventId: string;
  fight: Fight;
  isLocked: boolean;
  onPrediction: (fightId: string, winnerId: string) => void;
}

const FightRow: React.FC<{ fight: Fight; onPress: () => void }> = ({ fight, onPress }) => (
  <TouchableOpacity style={styles.fightRow} onPress={onPress}>
    <View style={styles.fighterContainer}>
      <View style={styles.fighterInfo}>
        <Text style={styles.fighterName}>{fight.redCorner.name}</Text>
        <Text style={styles.fighterRecord}>{fight.redCorner.record}</Text>
      </View>
      <Text style={styles.vs}>VS</Text>
      <View style={styles.fighterInfo}>
        <Text style={styles.fighterName}>{fight.blueCorner.name}</Text>
        <Text style={styles.fighterRecord}>{fight.blueCorner.record}</Text>
      </View>
    </View>
    <View style={styles.fightDetails}>
      <Text style={styles.weightClass}>{fight.weightClass}</Text>
      <Text style={styles.cardType}>{fight.card === 'main' ? 'Main Card' : 'Prelim'}</Text>
    </View>
  </TouchableOpacity>
);

export const FightCard: React.FC<FightCardProps> = ({ 
  eventId, 
  fight, 
  isLocked,
  onPrediction 
}) => {
  const { getEventById, getMainCardFights, getPrelimFights } = useEvents();
  const { user } = useAuth();
  const { getFighter } = useData();
  const [redFighter, setRedFighter] = useState<Fighter | null>(null);
  const [blueFighter, setBlueFighter] = useState<Fighter | null>(null);
  const [userPrediction, setUserPrediction] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  const event = getEventById(eventId);

  useEffect(() => {
    const loadFighters = async () => {
      const red = await getFighter(fight.redCorner.id);
      const blue = await getFighter(fight.blueCorner.id);
      setRedFighter(red);
      setBlueFighter(blue);
    };
    loadFighters();
  }, [fight]);

  useEffect(() => {
    if (!isLocked) {
      const timer = setInterval(() => {
        const now = new Date();
        const fightTime = new Date(fight.startTime);
        const diff = fightTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCountdown('LOCKED');
          clearInterval(timer);
          return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [fight.startTime, isLocked]);

  const handlePrediction = (winnerId: string) => {
    if (isLocked) {
      Alert.alert('Locked', 'This fight is locked. No more predictions allowed.');
      return;
    }

    Alert.alert(
      'Confirm Prediction',
      `Are you sure you want to pick ${winnerId === fight.redCorner.id ? redFighter?.name : blueFighter?.name} to win?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setUserPrediction(winnerId);
            onPrediction(fight.id, winnerId);
          }
        }
      ]
    );
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const mainCardFights = getMainCardFights(eventId);
  const prelimFights = getPrelimFights(eventId);

  if (!redFighter || !blueFighter) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.fightNumber}>Fight {fight.fight_number}</Text>
        <Text style={styles.weightClass}>{fight.weight_class}</Text>
      </View>

      <View style={styles.fightersContainer}>
        <TouchableOpacity 
          style={[
            styles.fighterCard,
            userPrediction === fight.redCorner.id && styles.selectedFighter
          ]}
          onPress={() => handlePrediction(fight.redCorner.id)}
          disabled={isLocked}
        >
          <Text style={styles.fighterName}>{redFighter.name}</Text>
          <Text style={styles.fighterRecord}>{redFighter.record}</Text>
          <Text style={styles.fighterStyle}>{redFighter.style}</Text>
        </TouchableOpacity>

        <View style={styles.vsContainer}>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.fighterCard,
            userPrediction === fight.blueCorner.id && styles.selectedFighter
          ]}
          onPress={() => handlePrediction(fight.blueCorner.id)}
          disabled={isLocked}
        >
          <Text style={styles.fighterName}>{blueFighter.name}</Text>
          <Text style={styles.fighterRecord}>{blueFighter.record}</Text>
          <Text style={styles.fighterStyle}>{blueFighter.style}</Text>
        </TouchableOpacity>
      </View>

      {isLocked && (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>LOCKED</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    ...colors.shadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.small,
  },
  fightNumber: {
    ...typography.h3,
    color: colors.text,
  },
  weightClass: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fightersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fighterCard: {
    flex: 1,
    padding: spacing.small,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginHorizontal: spacing.small,
  },
  selectedFighter: {
    backgroundColor: colors.primary,
  },
  fighterName: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'center',
  },
  fighterRecord: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fighterStyle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  vsContainer: {
    alignItems: 'center',
  },
  vs: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  countdown: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xsmall,
  },
  lockedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    ...typography.h3,
    color: colors.error,
  },
  loading: {
    padding: spacing.medium,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
}); 