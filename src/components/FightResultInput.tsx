import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useData } from '../contexts/DataContext';
import { Fight, FightResult } from '../types/data';
import { colors, spacing, typography } from '../utils/theme';

interface FightResultInputProps {
  fight: Fight;
  onResultSubmitted: () => void;
}

export const FightResultInput: React.FC<FightResultInputProps> = ({ fight, onResultSubmitted }) => {
  const { completeFight } = useData();
  const [winner, setWinner] = useState<'red' | 'blue' | null>(null);
  const [method, setMethod] = useState<'KO/TKO' | 'Submission' | 'Decision' | 'DQ' | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [time, setTime] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');

  const handleTimeSubmit = () => {
    const mins = parseInt(minutes);
    const secs = parseInt(seconds);
    
    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs >= 60) {
      Alert.alert('Invalid Time', 'Please enter a valid time');
      return;
    }

    setTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    if (!winner || !method || !round || !time) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result: FightResult = {
      winner,
      method,
      round,
      time
    };

    try {
      await completeFight(fight.id, result);
      Alert.alert('Success', 'Fight result submitted successfully');
      onResultSubmitted();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit fight result');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Fight Result</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Winner</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, winner === 'red' && styles.selectedButton]}
            onPress={() => setWinner('red')}
          >
            <Text style={[styles.buttonText, winner === 'red' && styles.selectedButtonText]}>
              {fight.redCorner.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, winner === 'blue' && styles.selectedButton]}
            onPress={() => setWinner('blue')}
          >
            <Text style={[styles.buttonText, winner === 'blue' && styles.selectedButtonText]}>
              {fight.blueCorner.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Method</Text>
        <View style={styles.buttonGroup}>
          {(['KO/TKO', 'Submission', 'Decision', 'DQ'] as const).map((m) => (
            <TouchableOpacity 
              key={m}
              style={[styles.button, method === m && styles.selectedButton]}
              onPress={() => setMethod(m)}
            >
              <Text style={[styles.buttonText, method === m && styles.selectedButtonText]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Round</Text>
        <View style={styles.buttonGroup}>
          {[1, 2, 3, 4, 5].map((r) => (
            <TouchableOpacity 
              key={r}
              style={[styles.button, round === r && styles.selectedButton]}
              onPress={() => setRound(r)}
            >
              <Text style={[styles.buttonText, round === r && styles.selectedButtonText]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time (MM:SS)</Text>
        <TouchableOpacity 
          style={styles.timeInput}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeText}>{time || 'Enter time'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Result</Text>
      </TouchableOpacity>

      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Time</Text>
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>Minutes</Text>
                <TextInput
                  style={styles.timeInputField}
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                />
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeLabel}>Seconds</Text>
                <TextInput
                  style={styles.timeInputField}
                  value={seconds}
                  onChangeText={setSeconds}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                />
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleTimeSubmit}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.medium,
    borderRadius: 12,
    margin: spacing.medium,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.small,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  button: {
    padding: spacing.small,
    borderRadius: 8,
    backgroundColor: colors.surface,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...typography.body,
    color: colors.text,
  },
  selectedButtonText: {
    color: colors.white,
  },
  timeInput: {
    padding: spacing.small,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  timeText: {
    ...typography.body,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  submitButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: 'bold',
  },
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
    width: '80%',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.medium,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  timeInputField: {
    width: 60,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: 8,
    textAlign: 'center',
    ...typography.body,
    color: colors.text,
  },
  timeSeparator: {
    ...typography.h2,
    color: colors.text,
    marginHorizontal: spacing.small,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.small,
  },
  modalButton: {
    flex: 1,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    ...typography.body,
    color: colors.text,
  },
  confirmButtonText: {
    color: colors.white,
  },
}); 