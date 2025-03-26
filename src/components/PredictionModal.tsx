import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Fight, Fighter, PredictionMethod } from '../types/data';
import DataService from '../services/DataService';

interface PredictionModalProps {
  visible: boolean;
  fight: Fight;
  onClose: () => void;
  onPredictionSubmit: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({
  visible,
  fight,
  onClose,
  onPredictionSubmit,
}) => {
  const [selectedWinner, setSelectedWinner] = useState<Fighter | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PredictionMethod | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const methods: PredictionMethod[] = ['KO/TKO', 'Submission', 'Decision', 'DQ'];
  const rounds = [1, 2, 3, 4, 5];

  const handleSubmit = async () => {
    if (!selectedWinner || !selectedMethod || !selectedRound) {
      Alert.alert('Error', 'Please make a complete prediction');
      return;
    }

    setLoading(true);
    try {
      await DataService.getInstance().submitPrediction({
        userId: 'current_user', // TODO: Get actual user ID
        fightId: fight.id,
        winner: selectedWinner,
        method: selectedMethod,
        round: selectedRound,
        timestamp: new Date().toISOString(),
      });
      onPredictionSubmit();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit prediction');
    } finally {
      setLoading(false);
    }
  };

  const renderFighterOption = (fighter: Fighter) => (
    <TouchableOpacity
      style={[
        styles.fighterOption,
        selectedWinner?.id === fighter.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedWinner(fighter)}
    >
      <Text style={styles.fighterName}>{fighter.name}</Text>
      <Text style={styles.fighterRecord}>{fighter.record}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Make Your Prediction</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Winner</Text>
              <View style={styles.fighterOptions}>
                {renderFighterOption(fight.redCorner)}
                {renderFighterOption(fight.blueCorner)}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Method</Text>
              <View style={styles.methodGrid}>
                {methods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodOption,
                      selectedMethod === method && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedMethod(method)}
                  >
                    <Text style={styles.methodText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Round</Text>
              <View style={styles.roundGrid}>
                {rounds.map((round) => (
                  <TouchableOpacity
                    key={round}
                    style={[
                      styles.roundOption,
                      selectedRound === round && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedRound(round)}
                  >
                    <Text style={styles.roundText}>Round {round}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Prediction</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  fighterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fighterOption: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  fighterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  fighterRecord: {
    fontSize: 14,
    color: '#666',
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodOption: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  methodText: {
    fontSize: 16,
    color: '#000',
  },
  roundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roundOption: {
    width: '18%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  roundText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PredictionModal; 