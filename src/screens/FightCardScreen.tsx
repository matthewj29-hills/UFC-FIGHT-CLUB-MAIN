import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation';
import { DataService } from '../services/DataService';
import { Event, Fight } from '../types/data';
import { colors, spacing, typography, formatDate, timeUntil } from '../utils';

const FightCardScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const upcomingEvents = await DataService.getInstance().getUpcomingEvents();
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderFightCard = ({ item: fight }: { item: Fight }) => (
    <TouchableOpacity
      style={styles.fightCard}
      onPress={() => navigation.navigate('FightDetails', { fight })}
    >
      <View style={styles.fightersContainer}>
        <View style={styles.fighter}>
          <Image
            source={{ uri: fight.fighter1.imageUrl }}
            style={styles.fighterImage}
          />
          <Text style={styles.fighterName}>{fight.fighter1.name}</Text>
          <Text style={styles.fighterRecord}>{fight.fighter1.record}</Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vs}>VS</Text>
        </View>

        <View style={styles.fighter}>
          <Image
            source={{ uri: fight.fighter2.imageUrl }}
            style={styles.fighterImage}
          />
          <Text style={styles.fighterName}>{fight.fighter2.name}</Text>
          <Text style={styles.fighterRecord}>{fight.fighter2.record}</Text>
        </View>
      </View>

      <View style={styles.fightInfo}>
        <Text style={styles.weightClass}>{fight.weight_class}</Text>
        {fight.isMain && <Text style={styles.mainEvent}>Main Event</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderEvent = ({ item: event }: { item: Event }) => (
    <View style={styles.eventContainer}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
      </View>

      <FlatList
        data={event.fights}
        renderItem={renderFightCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventHeader: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  eventName: {
    ...typography.h3,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  eventDate: {
    ...typography.body2,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  eventLocation: {
    ...typography.body2,
    color: colors.text.inverse,
  },
  fightCard: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  fightersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fighter: {
    flex: 1,
    alignItems: 'center',
  },
  fighterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.xs,
  },
  fighterName: {
    ...typography.subtitle2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xxs,
  },
  fighterRecord: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  vsContainer: {
    paddingHorizontal: spacing.sm,
  },
  vs: {
    ...typography.subtitle1,
    color: colors.text.secondary,
  },
  fightInfo: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  weightClass: {
    ...typography.body2,
    color: colors.text.primary,
    textTransform: 'uppercase',
  },
  mainEvent: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
});

export default FightCardScreen; 