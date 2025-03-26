import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Navigation Types
import { RootStackParamList, AuthStackParamList, MainTabParamList, MainStackParamList } from './types/navigation';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import FightCardScreen from './screens/FightCardScreen';
import StatsScreen from './screens/StatsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import FightDetailsScreen from './screens/FightDetailsScreen';
import PredictionScreen from './screens/PredictionScreen';
import LoadingScreen from './screens/LoadingScreen';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'FightCard') {
          iconName = focused ? 'fitness' : 'fitness-outline';
        } else if (route.name === 'Stats') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Leaderboard') {
          iconName = focused ? 'trophy' : 'trophy-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <MainTab.Screen name="Home" component={HomeScreen} />
    <MainTab.Screen name="FightCard" component={FightCardScreen} />
    <MainTab.Screen name="Stats" component={StatsScreen} />
    <MainTab.Screen name="Leaderboard" component={LeaderboardScreen} />
  </MainTab.Navigator>
);

// Main Stack Navigator (includes tabs and modal screens)
const MainNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <MainStack.Group screenOptions={{ presentation: 'modal' }}>
      <MainStack.Screen name="FightDetails" component={FightDetailsScreen} />
      <MainStack.Screen name="Prediction" component={PredictionScreen} />
    </MainStack.Group>
  </MainStack.Navigator>
);

// App Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
} 