import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { EventsScreen } from '../screens/EventsScreen';
import { EventDetailsScreen } from '../screens/EventDetailsScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { EventResultsScreen } from '../screens/EventResultsScreen';
import { UserManagementScreen } from '../screens/UserManagementScreen';
import { SystemSettingsScreen } from '../screens/SystemSettingsScreen';
import FightManagementScreen from '../screens/admin/FightManagementScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { colors, spacing } from '../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  EventsList: undefined;
  EventDetails: { eventId: string };
  EventResults: { eventId: string };
  UserManagement: undefined;
  SystemSettings: undefined;
  AdminDashboard: undefined;
  EventManagement: undefined;
  FightManagement: undefined;
};

export type TabParamList = {
  Events: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'hillsmj23@wfu.edu' || user?.email === 'hillmj23@wfu.edu';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const EventsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsScreen}
        options={{
          title: 'Events',
        }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: 'Event Details',
        }}
      />
      <Stack.Screen
        name="EventResults"
        component={EventResultsScreen}
        options={{
          title: 'Event Results',
        }}
      />
    </Stack.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminScreen}
        options={{
          title: 'Admin Dashboard',
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'User Management',
        }}
      />
      <Stack.Screen
        name="SystemSettings"
        component={SystemSettingsScreen}
        options={{
          title: 'System Settings',
        }}
      />
      <Stack.Screen
        name="FightManagement"
        component={FightManagementScreen}
        options={{
          title: 'Fight Management',
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}; 