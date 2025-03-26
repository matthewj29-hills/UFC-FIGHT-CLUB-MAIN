import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { EventInput, FightInput, FighterInput } from './types';

// Initialize Firebase Admin
const serviceAccount = require('../../../serviceAccountKey.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export async function updateEvent(eventInput: EventInput) {
  try {
    // Create event ID from name
    const eventId = eventInput.name.toLowerCase().replace(/\s+/g, '-');
    
    // Create event document
    const eventDoc = {
      id: eventId,
      name: eventInput.name,
      date: eventInput.date,
      location: eventInput.location,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add event to Firestore
    await db.collection('events').doc(eventId).set(eventDoc);
    console.log(`Created/Updated event: ${eventInput.name}`);

    // Process each fight
    for (const fight of eventInput.fights) {
      await addFight(eventId, fight);
    }

    console.log('Event update completed successfully');
    return true;
  } catch (error) {
    console.error('Error updating event:', error);
    return false;
  }
}

async function addFight(eventId: string, fightInput: FightInput) {
  // Create fighter IDs
  const fighter1Id = createFighterId(fightInput.fighter1.name);
  const fighter2Id = createFighterId(fightInput.fighter2.name);
  
  // Create fight ID
  const fightId = `${eventId}-${fighter1Id}-vs-${fighter2Id}`;

  // Add or update fighters
  await addFighter(fighter1Id, fightInput.fighter1);
  await addFighter(fighter2Id, fightInput.fighter2);

  // Create fight document
  const fightDoc = {
    id: fightId,
    eventId,
    fighter1: {
      id: fighter1Id,
      ...fightInput.fighter1
    },
    fighter2: {
      id: fighter2Id,
      ...fightInput.fighter2
    },
    weightClass: fightInput.weightClass,
    isMainEvent: fightInput.isMainEvent || false,
    rounds: fightInput.rounds,
    order: fightInput.order,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add fight to Firestore
  await db.collection('fights').doc(fightId).set(fightDoc);
  console.log(`Created/Updated fight: ${fightInput.fighter1.name} vs ${fightInput.fighter2.name}`);
}

async function addFighter(fighterId: string, fighterInput: FighterInput) {
  const fighterDoc = {
    id: fighterId,
    name: fighterInput.name,
    record: fighterInput.record,
    rank: fighterInput.rank || '',
    imageUrl: fighterInput.imageUrl || '',
    updatedAt: new Date().toISOString()
  };

  await db.collection('fighters').doc(fighterId).set(fighterDoc, { merge: true });
}

function createFighterId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Example usage:
/*
const exampleEvent: EventInput = {
  name: "UFC 300",
  date: "2024-04-13T00:00:00.000Z",
  location: "T-Mobile Arena, Las Vegas, NV",
  fights: [
    {
      fighter1: {
        name: "Alex Pereira",
        record: "9-2-0",
        rank: "C",
      },
      fighter2: {
        name: "Jamahal Hill",
        record: "12-1-0",
        rank: "#1",
      },
      weightClass: "Light Heavyweight",
      isMainEvent: true,
      rounds: 5,
      order: 1
    }
    // ... more fights
  ]
};

updateEvent(exampleEvent).then(() => console.log('Update complete'));
*/ 