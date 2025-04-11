import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fight, Fighter } from '../../types/data';
import { colors } from '../../utils/theme';
import { api } from '../../services/api';

interface FightManagementScreenProps {
  navigation: any;
  route: {
    params: {
      eventId: string;
    };
  };
}

export default function FightManagementScreen({ navigation, route }: FightManagementScreenProps) {
  const [fights, setFights] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFight, setEditingFight] = useState<Fight | null>(null);
  const [saving, setSaving] = useState(false);
  const [fighters, setFighters] = useState<Fighter[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadFights(), loadFighters()]);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFights = async () => {
    try {
      const data = await api.getFightDetails(route.params.eventId);
      setFights(data ? [data] : []);
    } catch (err) {
      console.error('Error loading fights:', err);
      throw err;
    }
  };

  const loadFighters = async () => {
    try {
      const data = await api.getFighterDetails('');
      setFighters(data ? [data] : []);
    } catch (err) {
      console.error('Error loading fighters:', err);
      throw err;
    }
  };

  const handleAddFight = () => {
    setEditingFight({
      id: '',
      eventId: route.params.eventId,
      fighter1Id: '',
      fighter2Id: '',
      weightClass: '',
      isTitleFight: false,
      rounds: 3,
      odds: {
        fighter1: '+100',
        fighter2: '+100'
      },
      status: 'upcoming',
      winner: null,
      method: null,
      time: null
    });
    setShowAddModal(true);
  };

  const handleEditFight = (fight: Fight) => {
    setEditingFight(fight);
    setShowAddModal(true);
  };

  const handleUpdateFight = async () => {
    if (!editingFight) return;

    try {
      setSaving(true);
      // TODO: Implement actual API call
      Alert.alert('Coming Soon', 'Fight updates will be available in the next release');
      setShowAddModal(false);
      await loadFights();
    } catch (err) {
      Alert.alert('Error', 'Failed to update fight. Please try again.');
      console.error('Error updating fight:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFight = (fightId: string) => {
    Alert.alert(
      'Delete Fight',
      'Are you sure you want to delete this fight? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement actual API call
              Alert.alert('Coming Soon', 'Fight deletion will be available in the next release');
              await loadFights();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete fight. Please try again.');
              console.error('Error deleting fight:', err);
            }
          }
        }
      ]
    );
  };

  const handleInputChange = (field: keyof Fight, value: string | number | boolean) => {
    if (!editingFight) return;
    setEditingFight({ ...editingFight, [field]: value });
  };

  const handleOddsChange = (fighter: 'fighter1' | 'fighter2', value: string) => {
    if (!editingFight) return;
    setEditingFight({
      ...editingFight,
      odds: {
        ...editingFight.odds,
        [fighter]: value
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredFights = fights.filter(fight => {
    const fighter1 = fighters.find(f => f.id === fight.fighter1Id);
    const fighter2 = fighters.find(f => f.id === fight.fighter2Id);
    return (
      fighter1?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter2?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fight.weightClass.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading fights...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fight Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFight}>
          <Icon name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search fights..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.textSecondary}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {filteredFights.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="alert-circle-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No fights found</Text>
            {searchQuery && (
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search
              </Text>
            )}
          </View>
        ) : (
          filteredFights.map(fight => {
            const fighter1 = fighters.find(f => f.id === fight.fighter1Id);
            const fighter2 = fighters.find(f => f.id === fight.fighter2Id);

            return (
              <View key={fight.id} style={styles.fightCard}>
                <View style={styles.fightHeader}>
                  <Text style={styles.fightTitle}>
                    {fight.isTitleFight ? 'Title Fight' : 'Fight'}
                  </Text>
                  <View style={styles.fightActions}>
                    <TouchableOpacity onPress={() => handleEditFight(fight)}>
                      <Icon name="pencil" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteFight(fight.id)}>
                      <Icon name="delete" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fightDetails}>
                  <Text style={styles.weightClass}>{fight.weightClass}</Text>
                  <Text style={styles.rounds}>{fight.rounds} Rounds</Text>
                </View>

                <View style={styles.fighters}>
                  <View style={styles.fighter}>
                    <Text style={styles.fighterName}>{fighter1?.name || 'TBD'}</Text>
                    <Text style={styles.fighterRecord}>{fighter1?.record || ''}</Text>
                    <Text style={styles.odds}>{fight.odds.fighter1}</Text>
                  </View>

                  <Text style={styles.vs}>VS</Text>

                  <View style={styles.fighter}>
                    <Text style={styles.fighterName}>{fighter2?.name || 'TBD'}</Text>
                    <Text style={styles.fighterRecord}>{fighter2?.record || ''}</Text>
                    <Text style={styles.odds}>{fight.odds.fighter2}</Text>
                  </View>
                </View>

                {fight.status === 'completed' && (
                  <View style={styles.result}>
                    <Text style={styles.resultText}>
                      Winner: {fighters.find(f => f.id === fight.winner)?.name || 'TBD'}
                    </Text>
                    <Text style={styles.resultText}>Method: {fight.method}</Text>
                    <Text style={styles.resultText}>Time: {fight.time}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingFight?.id ? 'Edit Fight' : 'Add Fight'}
            </Text>

            <TextInput
              style={styles.input}
              value={editingFight?.weightClass}
              onChangeText={(value) => handleInputChange('weightClass', value)}
              placeholder="Weight Class"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Title Fight</Text>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  editingFight?.isTitleFight && styles.checkboxChecked
                ]}
                onPress={() => handleInputChange('isTitleFight', !editingFight?.isTitleFight)}
              >
                {editingFight?.isTitleFight && (
                  <Icon name="check" size={16} color={colors.white} />
                )}
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editingFight?.rounds.toString()}
              onChangeText={(value) => handleInputChange('rounds', parseInt(value) || 3)}
              placeholder="Number of Rounds"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              value={editingFight?.odds.fighter1}
              onChangeText={(value) => handleOddsChange('fighter1', value)}
              placeholder="Fighter 1 Odds"
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={editingFight?.odds.fighter2}
              onChangeText={(value) => handleOddsChange('fighter2', value)}
              placeholder="Fighter 2 Odds"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateFight}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fightCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  fightActions: {
    flexDirection: 'row',
    gap: 16,
  },
  fightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weightClass: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  rounds: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fighters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fighter: {
    flex: 1,
    alignItems: 'center',
  },
  fighterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  fighterRecord: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  odds: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  result: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
}); 