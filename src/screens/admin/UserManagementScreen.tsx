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
  Platform,
} from 'react-native';
import { User, UserStats } from '../../types/data';
import { colors, spacing, typography } from '../../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UserWithStats extends User {
  stats?: UserStats;
  role?: 'admin' | 'user';
}

export const UserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('[UserManagement] Loading users...');
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const mockUsers: UserWithStats[] = [
        {
          uid: 'user1',
          email: 'john@example.com',
          displayName: 'John Doe',
          role: 'user',
          stats: {
            userId: 'user1',
            totalPredictions: 50,
            correctPredictions: 35,
            totalPoints: 1500,
            currentStreak: 5,
            longestStreak: 8,
            biggestUpset: {
              eventId: 'ufc299',
              fightId: 'fight1',
              points: 100,
              odds: 3.5,
            },
            accuracy: 70,
            rank: 5,
            lastThreePredictions: [],
            favoriteWeightClass: 'Lightweight',
            bestPerformingWeightClass: 'Welterweight',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: '2024-03-15T10:30:00Z',
            points: 1500,
            bestStreak: 8,
            upsetsPredicted: 3,
            lastUpdated: '2024-03-15T10:30:00Z'
          },
        },
        {
          uid: 'user2',
          email: 'jane@example.com',
          displayName: 'Jane Smith',
          role: 'admin',
          stats: {
            userId: 'user2',
            totalPredictions: 75,
            correctPredictions: 55,
            totalPoints: 2000,
            currentStreak: 3,
            longestStreak: 12,
            biggestUpset: {
              eventId: 'ufc298',
              fightId: 'fight2',
              points: 150,
              odds: 4.0,
            },
            accuracy: 73,
            rank: 2,
            lastThreePredictions: [],
            favoriteWeightClass: 'Middleweight',
            bestPerformingWeightClass: 'Lightweight',
            createdAt: '2023-12-15T00:00:00Z',
            lastLogin: '2024-03-15T11:15:00Z',
            points: 2000,
            bestStreak: 12,
            upsetsPredicted: 5,
            lastUpdated: '2024-03-15T11:15:00Z'
          },
        },
      ];
      setUsers(mockUsers);
      console.log('[UserManagement] Users loaded successfully');
    } catch (err) {
      console.error('[UserManagement] Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log('[UserManagement] Refreshing users...');
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleEditUser = (user: UserWithStats) => {
    console.log('[UserManagement] Editing user:', user.uid);
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (user: UserWithStats) => {
    try {
      console.log('[UserManagement] Updating user:', user.uid);
      setSaving(true);
      // TODO: Implement user update in Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'User updated successfully');
      setShowEditModal(false);
      await loadUsers();
    } catch (err) {
      console.error('[UserManagement] Error updating user:', err);
      Alert.alert('Error', 'Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: UserWithStats) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.displayName}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[UserManagement] Deleting user:', user.uid);
              // TODO: Implement user deletion in Firebase
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
              Alert.alert('Success', 'User deleted successfully');
              await loadUsers();
            } catch (err) {
              console.error('[UserManagement] Error deleting user:', err);
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleToggleAdmin = async (user: UserWithStats) => {
    try {
      console.log('[UserManagement] Toggling admin role for user:', user.uid);
      // TODO: Implement role toggle in Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      Alert.alert('Success', `User role updated to ${newRole}`);
      await loadUsers();
    } catch (err) {
      console.error('[UserManagement] Error toggling admin role:', err);
      Alert.alert('Error', 'Failed to update user role. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserCard = (user: UserWithStats) => (
    <View key={user.uid} style={styles.userCard}>
      <View style={styles.userHeader}>
        <View>
          <Text style={styles.username}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={[
          styles.roleBadge,
          { backgroundColor: user.role === 'admin' ? colors.primary : colors.success }
        ]}>
          <Text style={styles.roleText}>
            {user.role?.charAt(0).toUpperCase() + (user.role?.slice(1) || '')}
          </Text>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{user.stats?.totalPoints || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rank</Text>
          <Text style={styles.statValue}>#{user.stats?.rank || 'N/A'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Member Since</Text>
          <Text style={styles.statValue}>
            {user.stats?.createdAt ? new Date(user.stats.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Login</Text>
          <Text style={styles.statValue}>
            {user.stats?.lastLogin ? new Date(user.stats.lastLogin).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.userFooter}>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => handleToggleAdmin(user)}
        >
          <Text style={styles.toggleButtonText}>
            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditUser(user)}
          >
            <Icon name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(user)}
          >
            <Icon name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-search" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No users found</Text>
          </View>
        ) : (
          filteredUsers.map(renderUserCard)
        )}
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            {/* TODO: Add user edit form */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={() => selectedUser && handleUpdateUser(selectedUser)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
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
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.small,
  },
  searchInput: {
    flex: 1,
    padding: spacing.small,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: colors.surface,
    margin: spacing.medium,
    padding: spacing.medium,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  username: {
    ...typography.h2,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xsmall,
    borderRadius: 4,
  },
  roleText: {
    ...typography.caption,
    color: colors.white,
  },
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.medium,
  },
  statItem: {
    width: '50%',
    marginBottom: spacing.small,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.body,
    color: colors.text,
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.medium,
  },
  actionButton: {
    padding: spacing.small,
    borderRadius: 4,
  },
  toggleButton: {
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    ...typography.button,
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: spacing.small,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.medium,
    textAlign: 'center',
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
    alignSelf: 'center',
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
  modalContainer: {
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
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
}); 