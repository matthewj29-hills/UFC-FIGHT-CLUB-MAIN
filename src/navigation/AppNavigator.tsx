import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsList } from '../components/EventsList';
import { EventDetails } from '../components/EventDetails';
import { FighterProfile } from '../components/FighterProfile';
import { FightOdds } from '../components/FightOdds';
import { TestScreen } from '../screens/TestScreen';

export type RootStackParamList = {
  Events: undefined;
  EventDetails: { eventId: string };
  FighterProfile: { fighterName: string };
  FightDetails: { fightId: string };
  Test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Test"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Test"
          component={TestScreen}
          options={{ title: 'Navigation Test' }}
        />
        <Stack.Screen
          name="Events"
          component={EventsList}
          options={{ title: 'UFC Events' }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetails}
          options={{ title: 'Event Details' }}
        />
        <Stack.Screen
          name="FighterProfile"
          component={FighterProfile}
          options={{ title: 'Fighter Profile' }}
        />
        <Stack.Screen
          name="FightDetails"
          component={FightOdds}
          options={{ title: 'Fight Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 