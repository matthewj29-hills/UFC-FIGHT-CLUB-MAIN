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
import { Event, Fight } from '../../types/data';
import { colors, spacing, typography } from '../../utils/theme';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../services/api';

interface EventManagementScreenProps {
  navigation: any;
}

export default function EventManagementScreen({ navigation }: EventManagementScreenProps) {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Fetch events from the API
  const loadEvents = async () => {
    try {
      console.log('[EventManagement] Loading events...');
      setLoading(true);
      setError(null);
      const data = await api.getEvents();
      setEvents(data);
      console.log('[EventManagement] Events loaded successfully');
    } catch (err) {
      console.error('[EventManagement] Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    console.log('[EventManagement] Refreshing events...');
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Initialize a new event for adding
  const handleAddEvent = () => {
    console.log('[EventManagement] Adding new event...');
    setEditingEvent({
      id: `event-${Date.now()}`, // Generate a unique ID
      name: '',
      date: new Date().toISOString(),
      location: '',
      venue: '',
      status: 'upcoming',
      mainCard: [],
      prelimCard: [],
      broadcast: 'ESPN+ PPV'
    });
    setShowAddModal(true);
  };

  // Set up an event for editing
  const handleEditEvent = (event: Event) => {
    console.log('[EventManagement] Editing event:', event.id);
    setEditingEvent(event);
    setShowAddModal(true);
  };

  // Save event changes
  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      console.log('[EventManagement] Saving event:', editingEvent.id);
      setSaving(true);
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Event saved successfully');
      setShowAddModal(false);
      await loadEvents();
    } catch (err) {
      console.error('[EventManagement] Error saving event:', err);
      Alert.alert('Error', 'Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete an event with confirmation
  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[EventManagement] Deleting event:', eventId);
              // TODO: Implement actual API call
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
              Alert.alert('Success', 'Event deleted successfully');
              await loadEvents();
            } catch (err) {
              console.error('[EventManagement] Error deleting event:', err);
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle input changes in the form
  const handleInputChange = (field: keyof Event, value: string) => {
    if (!editingEvent) return;
    setEditingEvent({ ...editingEvent, [field]: value });
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <Icon name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-search" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No events found</Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventActions}>
                  <TouchableOpacity onPress={() => handleEditEvent(event)}>
                    <Icon name="pencil" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteEvent(event.id)}>
                    <Icon name="delete" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.eventDetails}>
                <Text style={styles.detailText}>Date: {new Date(event.date).toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Location: {event.location}</Text>
                <Text style={styles.detailText}>Venue: {event.venue}</Text>
                <Text style={styles.detailText}>Broadcast: {event.broadcast}</Text>
                <Text style={styles.detailText}>Main Card: {event.mainCard.length} fights</Text>
                <Text style={styles.detailText}>Prelims: {event.prelimCard.length} fights</Text>
                <Text style={[
                  styles.statusBadge,
                  { backgroundColor: event.status === 'upcoming' ? colors.success : colors.warning }
                ]}>
                  {event.status}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.fightsButton}
                onPress={() => navigation.navigate('FightManagement', { eventId: event.id })}
              >
                <Text style={styles.fightsButtonText}>Manage Fights</Text>
              </TouchableOpacity>
            </View>
          ))
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
              {editingEvent?.id ? 'Edit Event' : 'Add Event'}
            </Text>

            <TextInput
              style={styles.input}
              value={editingEvent?.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Event Name"
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={editingEvent?.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Location"
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={editingEvent?.venue}
              onChangeText={(value) => handleInputChange('venue', value)}
              placeholder="Venue"
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
                style={[styles.modalButton, styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleUpdateEvent}
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
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.medium,
    paddingHorizontal: spacing.small,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    padding: spacing.small,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.surface,
    margin: spacing.medium,
    padding: spacing.medium,
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  eventName: {
    ...typography.h2,
    color: colors.text,
  },
  eventActions: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  eventDetails: {
    marginBottom: spacing.medium,
  },
  detailText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xsmall,
  },
  statusBadge: {
    ...typography.caption,
    color: colors.white,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xsmall,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  fightsButton: {
    backgroundColor: colors.primary,
    padding: spacing.small,
    borderRadius: 4,
    alignItems: 'center',
  },
  fightsButtonText: {
    ...typography.button,
    color: colors.white,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.medium,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.large,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.large,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.background,
    padding: spacing.small,
    borderRadius: 4,
    marginBottom: spacing.medium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.large,
  },
  modalButton: {
    padding: spacing.medium,
    borderRadius: 4,
    marginLeft: spacing.medium,
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
  modalButtonText: {
    ...typography.button,
    color: colors.white,
  },
}); 