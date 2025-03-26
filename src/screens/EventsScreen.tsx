import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation';
import { EventCard } from '../components/EventCard';
import { useData } from '../contexts/DataContext';
import { colors, spacing } from '../utils/theme';

export const EventsScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { upcomingEvents, isLoading, refreshEvents } = useData();

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={upcomingEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshEvents}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
}); 