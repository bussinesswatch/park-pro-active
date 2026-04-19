const admin = require('firebase-admin');
const serviceAccount = require('./park-pro-active/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const users = [
  { email: 'admin1@parkpro.com', password: 'ParkPro2024!', displayName: 'Admin One' },
  { email: 'admin2@parkpro.com', password: 'ParkPro2024!', displayName: 'Admin Two' },
  { email: 'manager1@parkpro.com', password: 'ParkPro2024!', displayName: 'Manager One' },
  { email: 'manager2@parkpro.com', password: 'ParkPro2024!', displayName: 'Manager Two' },
  { email: 'user1@parkpro.com', password: 'ParkPro2024!', displayName: 'User One' },
  { email: 'user2@parkpro.com', password: 'ParkPro2024!', displayName: 'User Two' },
  { email: 'tech1@parkpro.com', password: 'ParkPro2024!', displayName: 'Technician One' },
  { email: 'tech2@parkpro.com', password: 'ParkPro2024!', displayName: 'Technician Two' },
  { email: 'ops1@parkpro.com', password: 'ParkPro2024!', displayName: 'Operations One' },
  { email: 'ops2@parkpro.com', password: 'ParkPro2024!', displayName: 'Operations Two' }
];

async function createUsers() {
  console.log('Creating Firebase Authentication users...\n');
  
  for (const user of users) {
    try {
      await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName
      });
      console.log(`✓ Created: ${user.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠ Already exists: ${user.email}`);
      } else {
        console.error(`✗ Failed: ${user.email} - ${error.message}`);
      }
    }
  }
  
  console.log('\n✅ Done! All users created in Firebase.');
  console.log('You can now login with any of these accounts.');
}

createUsers().then(() => process.exit());
