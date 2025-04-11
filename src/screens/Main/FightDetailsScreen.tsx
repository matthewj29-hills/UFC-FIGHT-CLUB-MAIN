import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components/common';
import { DataService } from '../services/DataService';
import { colors, spacing, typography } from '../utils';
import { Fight, Fighter, PredictionMethod } from '../types/data';
import { MainStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type FightDetailsRouteProp = RouteProp<MainStackParamList, 'FightDetails'>;
type FightDetailsNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function FightDetailsScreen() {
  const [fight, setFight] = useState<Fight | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PredictionMethod | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  const route = useRoute<FightDetailsRouteProp>();
  const navigation = useNavigation<FightDetailsNavigationProp>();
  const { user } = useAuth();
  const dataService = DataService.getInstance();

  useEffect(() => {
    loadFight();
  }, []);

  const loadFight = async () => {
    try {
      const fightData = await dataService.getFightById(route.params.fight.id);
      setFight(fightData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load fight details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async () => {
    if (!user || !fight || !selectedFighter || !selectedMethod) {
      Alert.alert('Error', 'Please select a fighter and method');
      return;
    }

    try {
      setPredicting(true);
      const predictionId = `${fight.id}_${user.uid}_${Date.now()}`;
      await dataService.createPrediction({
        id: predictionId,
        userId: user.uid,
        eventId: fight.id.split('_')[0],
        fightId: fight.id,
        winner: selectedFighter.id,
        method: selectedMethod,
        round: selectedRound || 1,
        timestamp: new Date().toISOString(),
      });

      Alert.alert('Success', 'Your prediction has been recorded!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit prediction');
    } finally {
      setPredicting(false);
    }
  };

  const renderFighterCard = (fighter: Fighter, isSelected: boolean) => (
    <View style={[styles.fighterCard, isSelected && styles.selectedFighter]}>
      <Button
        title={fighter.name}
        onPress={() => setSelectedFighter(fighter)}
        variant="outline"
        style={styles.fighterButton}
      >
        <Image
          source={{ uri: fighter.imageUrl || 'https://via.placeholder.com/100' }}
          style={styles.fighterImage as any}
        />
        <Text style={styles.fighterName}>{fighter.name}</Text>
        <Text style={styles.fighterRecord}>{fighter.record}</Text>
      </Button>
    </View>
  );

  const renderPredictionMethods = () => (
    <View style={styles.methodsContainer}>
      <Text style={styles.sectionTitle}>Method of Victory</Text>
      <View style={styles.methods}>
        {['KO/TKO', 'Submission', 'Decision', 'DQ'].map((method) => (
          <Button
            key={method}
            title={method}
            variant={selectedMethod === method ? 'primary' : 'outline'}
            onPress={() => setSelectedMethod(method as PredictionMethod)}
            style={styles.methodButton}
          />
        ))}
      </View>
    </View>
  );

  const renderRoundSelector = () => (
    <View style={styles.roundsContainer}>
      <Text style={styles.sectionTitle}>Round</Text>
      <View style={styles.rounds}>
        {Array.from({ length: fight?.rounds || 3 }, (_, i) => i + 1).map((round) => (
          <Button
            key={round}
            title={round.toString()}
            variant={selectedRound === round ? 'primary' : 'outline'}
            onPress={() => setSelectedRound(round)}
            style={styles.roundButton}
          />
        ))}
      </View>
    </View>
  );

  if (loading || !fight) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eventName}>{route.params.fight.id.split('_')[0]}</Text>
          <Text style={styles.weightClass}>{fight.weight_class}</Text>
          {fight.isMain && <Text style={styles.mainEvent}>Main Event</Text>}
        </View>

        <View style={styles.fighters}>
          {renderFighterCard(fight.fighter1, selectedFighter?.id === fight.fighter1.id)}
          <Text style={styles.vs}>VS</Text>
          {renderFighterCard(fight.fighter2, selectedFighter?.id === fight.fighter2.id)}
        </View>

        {renderPredictionMethods()}
        {selectedMethod !== 'Decision' && renderRoundSelector()}

        <Button
          title="Submit Prediction"
          onPress={handlePrediction}
          loading={predicting}
          disabled={!selectedFighter || !selectedMethod}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  eventName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  weightClass: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  mainEvent: {
    ...typography.body2,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  fighters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  fighterCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  selectedFighter: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  fighterImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.sm,
  },
  fighterName: {
    ...typography.body1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  fighterRecord: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  vs: {
    ...typography.h2,
    color: colors.primary,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  methodsContainer: {
    marginBottom: spacing.xl,
  },
  methods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  methodButton: {
    flex: 1,
    minWidth: '45%',
  },
  roundsContainer: {
    marginBottom: spacing.xl,
  },
  rounds: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roundButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  fighterButton: {
    width: '100%',
  },
}); 