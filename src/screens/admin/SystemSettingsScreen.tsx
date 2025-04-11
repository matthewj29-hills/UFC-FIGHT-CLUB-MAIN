import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// TODO: Add proper validation for all numeric inputs
// FIXME: Need to handle offline mode
// TODO: Consider adding undo/redo functionality
// FIXME: Some settings might need to be cached locally

interface SystemSettings {
  allowNewRegistrations: boolean;
  maintenanceMode: boolean;
  pointsPerCorrectPrediction: number;
  pointsPerPerfectPrediction: number;
  predictionLockInTime: number; // hours before event
  allowMethodPrediction: boolean;
  allowRoundPrediction: boolean;
  sendPredictionReminders: boolean;
  sendEventNotifications: boolean;
}

export const SystemSettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    allowNewRegistrations: true,
    maintenanceMode: false,
    pointsPerCorrectPrediction: 10,
    pointsPerPerfectPrediction: 25,
    predictionLockInTime: 1,
    allowMethodPrediction: true,
    allowRoundPrediction: true,
    sendPredictionReminders: true,
    sendEventNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // TODO: Move this to a custom hook
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('[SystemSettings] Fetching settings');
      setLoading(true);
      // TODO: Replace with actual API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      const mockSettings: SystemSettings = {
        allowNewRegistrations: true,
        maintenanceMode: false,
        pointsPerCorrectPrediction: 10,
        pointsPerPerfectPrediction: 25,
        predictionLockInTime: 1,
        allowMethodPrediction: true,
        allowRoundPrediction: true,
        sendPredictionReminders: true,
        sendEventNotifications: true,
      };
      
      console.log('[SystemSettings] Settings loaded:', mockSettings);
      setSettings(mockSettings);
    } catch (err) {
      console.error('[SystemSettings] Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('[SystemSettings] Saving settings:', settings);
      setSaving(true);
      // TODO: Replace with actual API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Settings saved successfully');
    } catch (err) {
      console.error('[SystemSettings] Error saving settings:', err);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof SystemSettings) => {
    console.log('[SystemSettings] Toggling setting:', key);
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNumberChange = (key: keyof SystemSettings, value: string) => {
    console.log('[SystemSettings] Changing numeric setting:', { key, value });
    const numValue = parseInt(value) || 0;
    
    // Add min/max validation based on setting type
    let constrainedValue = numValue;
    switch (key) {
      case 'pointsPerCorrectPrediction':
        constrainedValue = Math.max(0, Math.min(100, numValue));
        break;
      case 'pointsPerPerfectPrediction':
        constrainedValue = Math.max(0, Math.min(100, numValue));
        break;
      case 'predictionLockInTime':
        constrainedValue = Math.max(0, Math.min(24, numValue));
        break;
    }
    
    setSettings(prev => ({
      ...prev,
      [key]: constrainedValue,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSettings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access Control</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Allow New Registrations</Text>
          <Switch
            value={settings.allowNewRegistrations}
            onValueChange={() => handleToggle('allowNewRegistrations')}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Maintenance Mode</Text>
          <Switch
            value={settings.maintenanceMode}
            onValueChange={() => handleToggle('maintenanceMode')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Points System</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Points per Correct Prediction</Text>
          <TextInput
            style={styles.numberInput}
            value={settings.pointsPerCorrectPrediction.toString()}
            onChangeText={(value) => handleNumberChange('pointsPerCorrectPrediction', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Points per Perfect Prediction</Text>
          <TextInput
            style={styles.numberInput}
            value={settings.pointsPerPerfectPrediction.toString()}
            onChangeText={(value) => handleNumberChange('pointsPerPerfectPrediction', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prediction Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Prediction Lock-in Time (hours)</Text>
          <TextInput
            style={styles.numberInput}
            value={settings.predictionLockInTime.toString()}
            onChangeText={(value) => handleNumberChange('predictionLockInTime', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Allow Method Prediction</Text>
          <Switch
            value={settings.allowMethodPrediction}
            onValueChange={() => handleToggle('allowMethodPrediction')}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Allow Round Prediction</Text>
          <Switch
            value={settings.allowRoundPrediction}
            onValueChange={() => handleToggle('allowRoundPrediction')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Send Prediction Reminders</Text>
          <Switch
            value={settings.sendPredictionReminders}
            onValueChange={() => handleToggle('sendPredictionReminders')}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Send Event Notifications</Text>
          <Switch
            value={settings.sendEventNotifications}
            onValueChange={() => handleToggle('sendEventNotifications')}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// TODO: Consider moving styles to a separate file
// FIXME: Some styles might need adjustment for different screen sizes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.medium,
    ...typography.body,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  section: {
    marginBottom: spacing.large,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.medium,
    color: colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  settingLabel: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.medium,
  },
  numberInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: spacing.small,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    margin: spacing.large,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
}); 