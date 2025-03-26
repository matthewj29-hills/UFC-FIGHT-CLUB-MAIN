import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type TestScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Events'>;
};

export const TestScreen: React.FC<TestScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Test Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EventDetails', { eventId: 'test-event' })}
      >
        <Text style={styles.buttonText}>Go to Event Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FighterProfile', { fighterName: 'Test Fighter' })}
      >
        <Text style={styles.buttonText}>Go to Fighter Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 