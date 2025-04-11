import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
  Image,
} from 'react-native';
import { Fighter } from '../../types/data';
import { colors, spacing, typography } from '../../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useData } from '../../contexts/DataContext';

// TODO: Add image upload for fighters
// TODO: Add stats import from CSV
// FIXME: Search is kinda slow - need to optimize
// Note to self: add validation for record format

export const FighterManagementScreen: React.FC = () => {
  console.log('[FighterManagement] Rendering...'); // left for perf debugging
  const { getFighters, updateFighter, deleteFighter } = useData();
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddFighter, setShowAddFighter] = useState(false);
  const [editingFighter, setEditingFighter] = useState<Fighter | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);

  // temp fix until we implement proper form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const loadFighters = useCallback(async () => {
    try {
      console.log('Fetching fighters...');
      const fetchedFighters = await getFighters();
      console.log(`Loaded ${fetchedFighters.length} fighters`);
      setFighters(fetchedFighters);
      setError(null);
    } catch (err) {
      console.error('Error loading fighters:', err);
      setError('Failed to load fighters. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getFighters]);

  useEffect(() => {
    loadFighters();
  }, [loadFighters]);

  const handleAddFighter = () => {
    const newFighter: Fighter = {
      id: `fighter-${Date.now()}`, // Generate a unique ID
      name: '',
      record: '',
      height: '',
      weight: 0,
      reach: '',
      stance: '',
      lastThreeFights: [],
      nextThreeFights: [],
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
        noContests: 0,
        knockouts: 0,
        submissions: 0,
        decisions: 0,
        significantStrikesLanded: 0,
        significantStrikesAttempted: 0,
        takedownsLanded: 0,
        takedownsAttempted: 0,
        knockdowns: 0,
        reversals: 0,
        controlTime: 0,
        significantStrikeAccuracy: 0,
        takedownAccuracy: 0,
        submissionAverage: 0
      }
    };
    setEditingFighter(newFighter);
  };

  const handleEdit = (fighter: Fighter) => {
    console.log('[FighterManagement] Editing fighter:', fighter.id);
    setEditingFighter(fighter);
  };

  const handleSave = async () => {
    if (!editingFighter) return;

    try {
      console.log('[FighterManagement] Saving fighter:', editingFighter.id);
      setSaving(true);
      await updateFighter(editingFighter);
      await loadFighters();
      setEditingFighter(null);
      Alert.alert('Success', 'Fighter updated successfully');
    } catch (err) {
      console.error('[FighterManagement] Error saving fighter:', err);
      Alert.alert('Error', 'Failed to update fighter');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Fighter, value: string) => {
    if (!editingFighter) return;

    console.log('[FighterManagement] Changing field:', { field, value });
    setEditingFighter({
      ...editingFighter,
      [field]: value,
    });
  };

  const handleStatsChange = (field: keyof Fighter['stats'], value: string) => {
    if (!editingFighter) return;

    console.log('[FighterManagement] Changing stats:', { field, value });
    setEditingFighter({
      ...editingFighter,
      stats: {
        ...editingFighter.stats,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  const handleDeleteFighter = async (fighterId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this fighter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFighter(fighterId);
              await loadFighters();
              Alert.alert('Success', 'Fighter deleted successfully');
            } catch (err) {
              console.error('Error deleting fighter:', err);
              Alert.alert('Error', 'Failed to delete fighter');
            }
          },
        },
      ]
    );
  };

  const filteredFighters = fighters.filter(fighter =>
    fighter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFighterCard = (fighter: Fighter) => (
    <View key={fighter.id} style={styles.fighterCard}>
      <View style={styles.fighterHeader}>
        <Text style={styles.fighterName}>{fighter.name}</Text>
        <Text style={styles.fighterRecord}>{fighter.record}</Text>
      </View>

      <View style={styles.fighterDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Height:</Text>
          <Text style={styles.detailValue}>{fighter.height}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight:</Text>
          <Text style={styles.detailValue}>{fighter.weight} lbs</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reach:</Text>
          <Text style={styles.detailValue}>{fighter.reach}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Stance:</Text>
          <Text style={styles.detailValue}>{fighter.stance}</Text>
        </View>
      </View>

      <View style={styles.fighterFooter}>
        <View style={styles.statsSummary}>
          <Text style={styles.statsText}>
            {fighter.stats.wins}W {fighter.stats.losses}L {fighter.stats.draws}D
          </Text>
          <Text style={styles.statsText}>
            {fighter.stats.winsByKO} KO, {fighter.stats.winsBySubmission} SUB, {fighter.stats.winsByDecision} DEC
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setSelectedFighter(fighter);
              setShowEditModal(true);
            }}
          >
            <Icon name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteFighter(fighter.id)}
          >
            <Icon name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFighterForm = () => (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={editingFighter?.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter fighter name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Record</Text>
          <TextInput
            style={styles.input}
            value={editingFighter?.record}
            onChangeText={(value) => handleInputChange('record', value)}
            placeholder="Enter record (e.g., 25-1-0)"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            value={editingFighter?.height}
            onChangeText={(value) => handleInputChange('height', value)}
            placeholder="Enter height (e.g., 5'10')"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            value={String(editingFighter?.weight)}
            onChangeText={(value) => handleInputChange('weight', value)}
            keyboardType="numeric"
            placeholder="Enter weight in lbs"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reach</Text>
          <TextInput
            style={styles.input}
            value={editingFighter?.reach}
            onChangeText={(value) => handleInputChange('reach', value)}
            placeholder="Enter reach (e.g., 70')"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stance</Text>
          <TextInput
            style={styles.input}
            value={editingFighter?.stance}
            onChangeText={(value) => handleInputChange('stance', value)}
            placeholder="Enter stance (e.g., Orthodox, Southpaw)"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Fight Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wins</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.wins)}
              onChangeText={(value) => handleStatsChange('wins', value)}
              keyboardType="numeric"
              placeholder="Enter number of wins"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Losses</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.losses)}
              onChangeText={(value) => handleStatsChange('losses', value)}
              keyboardType="numeric"
              placeholder="Enter number of losses"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Draws</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.draws)}
              onChangeText={(value) => handleStatsChange('draws', value)}
              keyboardType="numeric"
              placeholder="Enter number of draws"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>No Contests</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.noContests)}
              onChangeText={(value) => handleStatsChange('noContests', value)}
              keyboardType="numeric"
              placeholder="Enter number of no contests"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wins by KO</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.winsByKO)}
              onChangeText={(value) => handleStatsChange('winsByKO', value)}
              keyboardType="numeric"
              placeholder="Enter wins by KO"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wins by Submission</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.winsBySubmission)}
              onChangeText={(value) => handleStatsChange('winsBySubmission', value)}
              keyboardType="numeric"
              placeholder="Enter wins by submission"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wins by Decision</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.winsByDecision)}
              onChangeText={(value) => handleStatsChange('winsByDecision', value)}
              keyboardType="numeric"
              placeholder="Enter wins by decision"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Losses by KO</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.lossesByKO)}
              onChangeText={(value) => handleStatsChange('lossesByKO', value)}
              keyboardType="numeric"
              placeholder="Enter losses by KO"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Losses by Submission</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.lossesBySubmission)}
              onChangeText={(value) => handleStatsChange('lossesBySubmission', value)}
              keyboardType="numeric"
              placeholder="Enter losses by submission"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Losses by Decision</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.lossesByDecision)}
              onChangeText={(value) => handleStatsChange('lossesByDecision', value)}
              keyboardType="numeric"
              placeholder="Enter losses by decision"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Significant Strikes/Min</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.significantStrikesPerMinute)}
              onChangeText={(value) => handleStatsChange('significantStrikesPerMinute', value)}
              keyboardType="numeric"
              placeholder="Enter significant strikes per minute"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Strike Accuracy</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.significantStrikesAccuracy)}
              onChangeText={(value) => handleStatsChange('significantStrikesAccuracy', value)}
              keyboardType="numeric"
              placeholder="Enter strike accuracy"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Strike Defense</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.significantStrikesDefense)}
              onChangeText={(value) => handleStatsChange('significantStrikesDefense', value)}
              keyboardType="numeric"
              placeholder="Enter strike defense"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Takedown Average</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.takedownAverage)}
              onChangeText={(value) => handleStatsChange('takedownAverage', value)}
              keyboardType="numeric"
              placeholder="Enter takedown average"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Takedown Accuracy</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.takedownAccuracy)}
              onChangeText={(value) => handleStatsChange('takedownAccuracy', value)}
              keyboardType="numeric"
              placeholder="Enter takedown accuracy"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Takedown Defense</Text>
            <TextInput
              style={styles.input}
              value={String(editingFighter?.stats?.takedownDefense)}
              onChangeText={(value) => handleStatsChange('takedownDefense', value)}
              keyboardType="numeric"
              placeholder="Enter takedown defense"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => {
            setShowEditModal(false);
            setShowAddFighter(false);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadFighters}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Fighters</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFighter}
        >
          <Icon name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search fighters..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <ScrollView style={styles.fightersContainer}>
        {filteredFighters.map(renderFighterCard)}
      </ScrollView>

      <Modal
        visible={showEditModal || showAddFighter}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {showAddFighter ? 'Add New Fighter' : 'Edit Fighter'}
            </Text>
            {renderFighterForm()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.medium,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.small,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.small,
    color: colors.text,
    ...typography.body,
  },
  fightersContainer: {
    flex: 1,
  },
  fighterCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.small,
  },
  fighterHeader: {
    marginBottom: spacing.medium,
  },
  fighterName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  fighterRecord: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fighterDetails: {
    marginBottom: spacing.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xsmall,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
  },
  fighterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.small,
  },
  statsSummary: {
    flex: 1,
  },
  statsText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    borderColor: colors.primary,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.large,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.large,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  formContainer: {
    flex: 1,
  },
  formSection: {
    marginBottom: spacing.large,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  inputGroup: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xsmall,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.medium,
    color: colors.text,
    ...typography.body,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.medium,
    marginBottom: spacing.medium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.medium,
    marginTop: spacing.large,
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
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 