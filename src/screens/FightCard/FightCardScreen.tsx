import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp } from '../../types/navigation';
import DataService from '../../services/DataService';
import { Event, Fight } from '../../types/data';
import PredictionModal from '../../components/PredictionModal';

const FightCardScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);

  const loadEventData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'UFC 300',
          date: '2024-04-13',
          location: 'Las Vegas, Nevada',
          fights: [
            {
              id: '1',
              eventId: '1',
              redCorner: {
                id: '1',
                name: 'Jon Jones',
                record: '27-1-0',
                height: '6\'4"',
                weight: '248 lbs',
                stance: 'Orthodox',
              },
              blueCorner: {
                id: '2',
                name: 'Stipe Miocic',
                record: '20-4-0',
                height: '6\'4"',
                weight: '234 lbs',
                stance: 'Orthodox',
              },
              weightClass: 'Heavyweight',
              isMainEvent: true,
              isPrelim: false,
              status: 'scheduled',
            },
            {
              id: '2',
              eventId: '1',
              redCorner: {
                id: '3',
                name: 'Alex Pereira',
                record: '9-2-0',
                height: '6\'4"',
                weight: '205 lbs',
                stance: 'Orthodox',
              },
              blueCorner: {
                id: '4',
                name: 'Jamahal Hill',
                record: '12-1-0',
                height: '6\'0"',
                weight: '205 lbs',
                stance: 'Orthodox',
              },
              weightClass: 'Light Heavyweight',
              isMainEvent: false,
              isPrelim: false,
              status: 'scheduled',
            },
          ],
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEventData();
  };

  const handleFightPress = (fight: Fight) => {
    setSelectedFight(fight);
    setShowPredictionModal(true);
  };

  const handlePredictionSubmit = () => {
    // Refresh the event data to show updated predictions
    loadEventData();
  };

  const renderFight = ({ item: fight }: { item: Fight }) => (
    <TouchableOpacity
      style={styles.fightCard}
      onPress={() => handleFightPress(fight)}
    >
      <View style={styles.fightHeader}>
        <Text style={styles.weightClass}>{fight.weightClass}</Text>
        {fight.isMainEvent && (
          <Text style={styles.titleFight}>Main Event</Text>
        )}
      </View>

      <View style={styles.fighters}>
        <View style={styles.fighter}>
          <Text style={styles.fighterName}>{fight.redCorner.name}</Text>
          <Text style={styles.fighterRecord}>{fight.redCorner.record}</Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.fighter}>
          <Text style={styles.fighterName}>{fight.blueCorner.name}</Text>
          <Text style={styles.fighterRecord}>{fight.blueCorner.record}</Text>
        </View>
      </View>

      <View style={styles.fightFooter}>
        <Text style={styles.status}>{fight.status}</Text>
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
      </View>
      <Text style={styles.eventLocation}>{event.location}</Text>
      <FlatList
        data={event.fights}
        renderItem={renderFight}
        keyExtractor={(fight) => fight.id}
        scrollEnabled={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(event) => event.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedFight && (
        <PredictionModal
          visible={showPredictionModal}
          fight={selectedFight}
          onClose={() => {
            setShowPredictionModal(false);
            setSelectedFight(null);
          }}
          onPredictionSubmit={handlePredictionSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  fightCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  fightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weightClass: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  titleFight: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  fighters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fighter: {
    flex: 1,
    alignItems: 'center',
  },
  fighterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  fighterRecord: {
    fontSize: 12,
    color: '#666',
  },
  vs: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 10,
  },
  fightFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default FightCardScreen; 