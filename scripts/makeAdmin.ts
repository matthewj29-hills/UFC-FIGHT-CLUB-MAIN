import * as admin from 'firebase-admin';

// Initialize admin SDK
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function makeUserAdmin(email: string) {
  try {
    // Get the user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`Successfully made ${email} an admin!`);
  } catch (error) {
    console.error('Error making user admin:', error);
  }
}

// Replace with your email
const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('Please provide an email address as an argument');
  process.exit(1);
}

makeUserAdmin(adminEmail); 