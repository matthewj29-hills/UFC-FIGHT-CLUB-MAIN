import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Event, Fight, Fighter } from '../types/data';
import { formatDate } from '../utils/date';
import { colors, spacing, typography } from '../utils/theme';

// TODO: Add proper error handling for image loading
// TODO: Add image caching
// FIXME: Fighter stats sometimes undefined
// TODO: Consider using react-native-fast-image for better performance
// FIXME: iOS shadow rendering is inconsistent on some devices

interface FightCardProps {
  eventId: string;
  fight: Fight;
  isLocked: boolean;
  onPrediction: (fightId: string, winnerId: string) => void;
  showOdds?: boolean; // might remove this later
}

export const FightCard: React.FC<FightCardProps> = ({ 
  eventId, 
  fight, 
  isLocked,
  onPrediction,
  showOdds = true, // default to true for now
}) => {
  const { getEventById } = useEvents();
  const { user } = useAuth();
  const { getFighter } = useData();
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [userPrediction, setUserPrediction] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [cardStatus, setCardStatus] = useState<'scheduled' | 'locked' | 'in_progress' | 'completed'>('scheduled');
  const [imageError1, setImageError1] = useState(false);
  const [imageError2, setImageError2] = useState(false);

  const event = getEventById(eventId);

  // Load fighter data - might want to move this to a custom hook later
  useEffect(() => {
    const loadFighters = async () => {
      try {
        console.log('[FightCard] Loading fighters for fight:', fight.id);
        const fighter1Data = await getFighter(fight.fighter1Id);
        const fighter2Data = await getFighter(fight.fighter2Id);
        
        // Debug logging
        console.log('[FightCard] Fighter 1 loaded:', fighter1Data?.name);
        console.log('[FightCard] Fighter 2 loaded:', fighter2Data?.name);
        
        setFighter1(fighter1Data);
        setFighter2(fighter2Data);
      } catch (err) {
        console.error('[FightCard] Error loading fighters:', err);
        // TODO: Add proper error handling UI
      }
    };
    loadFighters();
  }, [fight]);

  // Handle countdown and status updates
  useEffect(() => {
    const updateStatus = async () => {
      const now = new Date();
      const eventDate = new Date(event?.date || '');
      
      if (now > eventDate) {
        setCardStatus('completed');
      } else if (isLocked) {
        setCardStatus('locked');
      } else {
        setCardStatus('scheduled');
      }
    };

    const timer = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(event?.date || '');
      const diff = eventDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown('IN PROGRESS');
        updateStatus();
        clearInterval(timer);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [eventId, event?.date, isLocked]);

  const handlePrediction = (winnerId: string) => {
    if (cardStatus === 'locked' || cardStatus === 'in_progress' || cardStatus === 'completed') {
      Alert.alert('Locked', 'Predictions are locked. No more predictions allowed.');
      return;
    }

    Alert.alert(
      'Confirm Prediction',
      `Are you sure you want to pick ${winnerId === fight.fighter1Id ? fighter1?.name : fighter2?.name} to win?`,
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

  if (!fighter1 || !fighter2) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  // Debug logging for fighter data
  console.log('[FightCard] Rendering fight:', {
    fightId: fight.id,
    fighter1: fighter1.name,
    fighter2: fighter2.name,
    status: cardStatus
  });

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        Platform.OS === 'ios' ? styles.iosShadow : { elevation: 3 },
      ]} 
      onPress={() => handlePrediction(fight.fighter1Id)}
      disabled={cardStatus !== 'scheduled'}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.fighterContainer}>
          <Image
            source={{ uri: fighter1.imageUrl || `https://api.ufc.com/fighters/${fight.fighter1Id}/image` }}
            style={styles.fighterImage}
            onError={() => {
              console.log('[FightCard] Fighter 1 image failed to load');
              setImageError1(true);
            }}
          />
          <Text style={styles.fighterName}>{fighter1.name}</Text>
          <Text style={styles.fighterRecord}>{fighter1.record}</Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          {showOdds && (
            <View style={styles.oddsContainer}>
              <Text style={[
                styles.odds,
                parseFloat(fight.odds.fighter1) > 0 ? {color: 'green'} : {color: 'red'}
              ]}>
                {fight.odds.fighter1}
              </Text>
              <Text style={[
                styles.odds,
                parseFloat(fight.odds.fighter2) > 0 ? {color: 'green'} : {color: 'red'}
              ]}>
                {fight.odds.fighter2}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fighterContainer}>
          <Image
            source={{ uri: fighter2.imageUrl || `https://api.ufc.com/fighters/${fight.fighter2Id}/image` }}
            style={styles.fighterImage}
            onError={() => {
              console.log('[FightCard] Fighter 2 image failed to load');
              setImageError2(true);
            }}
          />
          <Text style={styles.fighterName}>{fighter2.name}</Text>
          <Text style={styles.fighterRecord}>{fighter2.record}</Text>
        </View>
      </View>

      <View style={styles.fightDetails}>
        <Text style={styles.weightClass}>{fight.weightClass}</Text>
        {fight.isTitleFight && (
          <Text style={styles.titleFight}>Title Fight</Text>
        )}
      </View>

      {cardStatus !== 'scheduled' && (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>
            {cardStatus === 'locked' ? 'LOCKED' : 
             cardStatus === 'in_progress' ? 'IN PROGRESS' : 'COMPLETED'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// TODO: Consider moving styles to a separate file
// TODO: Add dark mode support
// FIXME: Some styles might need adjustment for different screen sizes
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fighterContainer: {
    alignItems: 'center',
    flex: 1,
  },
  fighterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#f0f0f0', // placeholder color
  },
  fighterName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  fighterRecord: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  oddsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  odds: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 2,
  },
  fightDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightClass: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  titleFight: {
    fontSize: 14,
    color: '#FFD700', // gold color for title fights
    fontWeight: '600',
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