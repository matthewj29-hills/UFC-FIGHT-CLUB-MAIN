import * as admin from 'firebase-admin';

// Initialize admin SDK
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const events = [
  {
    id: 'ufc_297',
    name: 'UFC 297: Strickland vs Du Plessis',
    date: new Date('2024-01-20'),
    location: 'Toronto, Ontario',
    imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/event_fight_card_upper_body_of_standing_athlete/s3/2023-12/297_EVENT_PROMO_UPPER_BODY.jpg?itok=VpQpBxvD',
    fights: [
      {
        id: 'ufc_297_1',
        fighter1: {
          id: 'sean_strickland',
          name: 'Sean Strickland',
          record: '28-5-0',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-09/STRICKLAND_SEAN_L_BELT_09_09.png?itok=N9tXGHBl'
        },
        fighter2: {
          id: 'dricus_du_plessis',
          name: 'Dricus Du Plessis',
          record: '20-2-0',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/DU%20PLESSIS_DRICUS_L_07-08.png?itok=7RV4Y8qP'
        },
        weight_class: 'Middleweight',
        isMain: true,
        rounds: 5,
        isTitle: true
      },
      {
        id: 'ufc_297_2',
        fighter1: {
          id: 'raquel_pennington',
          name: 'Raquel Pennington',
          record: '15-9-0',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-03/PENNINGTON_RAQUEL_L_03-04.png?itok=7SY8NG-C'
        },
        fighter2: {
          id: 'mayra_bueno_silva',
          name: 'Mayra Bueno Silva',
          record: '10-2-1',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/SILVA_MAYRA%20BUENO_L_07-01.png?itok=_ZYDdGEO'
        },
        weight_class: "Women's Bantamweight",
        isMain: false,
        rounds: 5,
        isTitle: true
      }
    ]
  },
  {
    id: 'ufc_298',
    name: 'UFC 298: Volkanovski vs Topuria',
    date: new Date('2024-02-17'),
    location: 'Anaheim, California',
    imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/event_fight_card_upper_body_of_standing_athlete/s3/2023-12/298_EVENT_PROMO_UPPER_BODY.jpg?itok=1Hs6PuOY',
    fights: [
      {
        id: 'ufc_298_1',
        fighter1: {
          id: 'alexander_volkanovski',
          name: 'Alexander Volkanovski',
          record: '26-3-0',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/VOLKANOVSKI_ALEXANDER_L_BELT_10-21.png?itok=7TJ2_0Ey'
        },
        fighter2: {
          id: 'ilia_topuria',
          name: 'Ilia Topuria',
          record: '14-0-0',
          imageUrl: 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-06/TOPURIA_ILIA_L_06-24.png?itok=qfEk8_1a'
        },
        weight_class: 'Featherweight',
        isMain: true,
        rounds: 5,
        isTitle: true
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Add events
    for (const event of events) {
      const { fights, ...eventData } = event;
      await db.collection('events').doc(event.id).set({
        ...eventData,
        date: admin.firestore.Timestamp.fromDate(event.date)
      });
      console.log(`Added event: ${event.name}`);

      // Add fights for this event
      for (const fight of fights) {
        await db.collection('fights').doc(fight.id).set({
          ...fight,
          eventId: event.id
        });
        console.log(`Added fight: ${fight.fighter1.name} vs ${fight.fighter2.name}`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase(); 