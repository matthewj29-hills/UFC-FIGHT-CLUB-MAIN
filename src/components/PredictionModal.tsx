import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { Fight } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';

interface PredictionModalProps {
  visible: boolean;
  fight: Fight | null;
  onClose: () => void;
  onSubmit: (fight: Fight, selectedFighter: string, confidence: number) => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  visible,
  fight,
  onClose,
  onSubmit,
}) => {
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [confidence, setConfidence] = useState('80');

  const handleSubmit = () => {
    if (!fight || !selectedFighter) {
      Alert.alert('Error', 'Please select a fighter');
      return;
    }

    const confidenceNum = parseInt(confidence);
    if (isNaN(confidenceNum) || confidenceNum < 0 || confidenceNum > 100) {
      Alert.alert('Error', 'Please enter a valid confidence level (0-100)');
      return;
    }

    onSubmit(fight, selectedFighter, confidenceNum);
  };

  if (!fight) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Make Prediction</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fightInfo}>
            <Text style={styles.weightClass}>{fight.weightClass}</Text>
            <Text style={styles.fightDetails}>
              {fight.round} Rounds • {fight.time} Minutes
            </Text>
          </View>

          <View style={styles.fightersContainer}>
            <TouchableOpacity
              style={[
                styles.fighterButton,
                selectedFighter === fight.fighter1.name && styles.selectedFighter,
              ]}
              onPress={() => setSelectedFighter(fight.fighter1.name)}
            >
              <Text style={styles.fighterName}>{fight.fighter1.name}</Text>
              <Text style={styles.fighterRecord}>{fight.fighter1.record}</Text>
              <Text style={styles.fighterOdds}>{fight.odds.fighter1}</Text>
            </TouchableOpacity>

            <Text style={styles.vsText}>VS</Text>

            <TouchableOpacity
              style={[
                styles.fighterButton,
                selectedFighter === fight.fighter2.name && styles.selectedFighter,
              ]}
              onPress={() => setSelectedFighter(fight.fighter2.name)}
            >
              <Text style={styles.fighterName}>{fight.fighter2.name}</Text>
              <Text style={styles.fighterRecord}>{fight.fighter2.record}</Text>
              <Text style={styles.fighterOdds}>{fight.odds.fighter2}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence Level (%)</Text>
            <TextInput
              style={styles.confidenceInput}
              value={confidence}
              onChangeText={setConfidence}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={!selectedFighter}
          >
            <Text style={styles.submitButtonText}>Submit Prediction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.medium,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    ...typography.h1,
    color: colors.textSecondary,
    fontSize: 32,
    lineHeight: 32,
  },
  fightInfo: {
    marginBottom: spacing.medium,
  },
  weightClass: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  fightDetails: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fightersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  fighterButton: {
    flex: 1,
    padding: spacing.medium,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  selectedFighter: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  fighterName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  fighterRecord: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  fighterOdds: {
    ...typography.body,
    color: colors.primary,
  },
  vsText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginHorizontal: spacing.medium,
  },
  confidenceContainer: {
    marginBottom: spacing.medium,
  },
  confidenceLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  confidenceInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.small,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    ...typography.button,
    color: colors.white,
  },
}); 