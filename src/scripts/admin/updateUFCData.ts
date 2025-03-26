import { UFCDataGatherer } from './gatherData';
import { db } from '../../config/firebase';

async function updateUFCData() {
  console.log('Starting UFC data update...');
  const dataGatherer = new UFCDataGatherer();

  try {
    // Gather event data
    console.log('Gathering data from UFC sources...');
    const events = await dataGatherer.gatherRecentAndUpcomingEvents(5, 3);
    console.log(`Found ${events.length} events to update`);

    // Update events in Firebase
    for (const event of events) {
      try {
        await db.collection('events').doc(event.id).set(event, { merge: true });
        console.log(`Updated event: ${event.name}`);

        // Get and update fighter details
        for (const fight of event.fights) {
          const fighter1Details = await dataGatherer.getFighterDetails(fight.fighter1.id);
          const fighter2Details = await dataGatherer.getFighterDetails(fight.fighter2.id);

          if (fighter1Details) {
            await db.collection('fighters').doc(fighter1Details.id).set(fighter1Details, { merge: true });
            console.log(`Updated fighter: ${fighter1Details.name}`);
          }

          if (fighter2Details) {
            await db.collection('fighters').doc(fighter2Details.id).set(fighter2Details, { merge: true });
            console.log(`Updated fighter: ${fighter2Details.name}`);
          }
        }
      } catch (error) {
        console.error(`Error updating event ${event.name}:`, error);
      }
    }

    // Update division rankings
    const rankings = await dataGatherer.getDivisionRankings();
    await db.collection('rankings').doc('current').set({ divisions: rankings });
    console.log('Updated division rankings');

    console.log('UFC data update completed successfully');
  } catch (error) {
    console.error('Error during UFC data update:', error);
  }
}

updateUFCData(); 