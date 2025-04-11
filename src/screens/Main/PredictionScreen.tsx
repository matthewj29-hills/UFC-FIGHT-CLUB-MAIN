import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { Button } from '../components/common';
import { DataService } from '../services/DataService';
import { useAuth } from '../contexts/AuthContext';
import { PREDICTION_METHODS } from '../utils/constants';
import { colors, spacing, typography } from '../utils';

type Props = NativeStackScreenProps<MainStackParamList, 'Prediction'>;

const PredictionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { fight } = route.params;
  const { user } = useAuth();
  const [selectedFighter, setSelectedFighter] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedFighter || !selectedMethod) {
      Alert.alert('Error', 'Please select a winner and method of victory');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit predictions');
      return;
    }

    setLoading(true);
    try {
      await DataService.getInstance().submitPrediction({
        userId: user.uid,
        eventId: fight.id.split('_')[0], // Assuming fight.id is in format "eventId_fightId"
        fightId: fight.id,
        winner: selectedFighter,
        method: selectedMethod,
        round: selectedRound || undefined,
      });

      Alert.alert('Success', 'Your prediction has been submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Winner</Text>
          <View style={styles.buttonGroup}>
            <Button
              title={fight.fighter1.name}
              variant={selectedFighter === fight.fighter1.id ? 'primary' : 'outline'}
              onPress={() => setSelectedFighter(fight.fighter1.id)}
              style={styles.button}
            />
            <Button
              title={fight.fighter2.name}
              variant={selectedFighter === fight.fighter2.id ? 'primary' : 'outline'}
              onPress={() => setSelectedFighter(fight.fighter2.id)}
              style={styles.button}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Method of Victory</Text>
          <View style={styles.buttonGroup}>
            {Object.entries(PREDICTION_METHODS).map(([key, value]) => (
              <Button
                key={key}
                title={value}
                variant={selectedMethod === value ? 'primary' : 'outline'}
                onPress={() => setSelectedMethod(value)}
                style={styles.button}
              />
            ))}
          </View>
        </View>

        {(selectedMethod === PREDICTION_METHODS.KO_TKO ||
          selectedMethod === PREDICTION_METHODS.SUBMISSION) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Round</Text>
            <View style={styles.buttonGroup}>
              {Array.from({ length: fight.rounds }, (_, i) => i + 1).map((round) => (
                <Button
                  key={round}
                  title={`Round ${round}`}
                  variant={selectedRound === round ? 'primary' : 'outline'}
                  onPress={() => setSelectedRound(round)}
                  style={styles.roundButton}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.submitSection}>
          <Button
            title="Submit Prediction"
            onPress={handleSubmit}
            loading={loading}
            disabled={!selectedFighter || !selectedMethod}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle1,
    marginBottom: spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  button: {
    flex: 1,
    minWidth: '45%',
    marginBottom: spacing.xs,
  },
  roundButton: {
    width: '30%',
    marginBottom: spacing.xs,
  },
  submitSection: {
    marginTop: spacing.xl,
  },
});

export default PredictionScreen; 