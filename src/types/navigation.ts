import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Event, Fight } from './data';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  EventDetails: { eventId: string };
  FightDetails: { fight: Fight };
  FightManagement: { eventId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  EventDetails: { eventId: string };
  EventResults: { eventId: string };
  UserManagement: undefined;
  SystemSettings: undefined;
  FightManagement: { eventId: string };
};

export type MainTabParamList = {
  Events: undefined;
  Profile: undefined;
  Admin: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  FightDetails: { fight: Fight };
  Prediction: { fight: Fight };
};

// Navigation Props
export type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

// Declare global type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 