import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import app from '../../config/firebase';
import fighterData from '../../data/fighterData.json';

const db = getFirestore(app);

async function importFighterData() {
  console.log('Starting fighter data import...');

  try {
    // Import fighters
    console.log('Importing fighters...');
    for (const fighter of fighterData.fighters) {
      await setDoc(doc(db, 'fighters', fighter.id), fighter, { merge: true });
      console.log(`Imported fighter: ${fighter.name}`);
    }

    // Import events
    console.log('Importing events...');
    for (const event of fighterData.events) {
      await setDoc(doc(db, 'events', event.id), event, { merge: true });
      console.log(`Imported event: ${event.name}`);
    }

    // Import rankings
    console.log('Importing rankings...');
    await setDoc(doc(db, 'rankings', 'current'), fighterData.rankings, { merge: true });
    console.log('Imported rankings');

    console.log('Fighter data import completed successfully');
  } catch (error) {
    console.error('Error importing fighter data:', error);
  }
}

importFighterData(); 