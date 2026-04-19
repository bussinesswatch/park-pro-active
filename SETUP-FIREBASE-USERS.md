# Setup Firebase Authentication Users

## Issue: 400 Error on Login

The console shows a 400 error because the pre-configured users don't exist in Firebase Authentication yet.

## Solution: Create Users in Firebase Console

### Option 1: Manual Creation (Quick)

1. Go to https://console.firebase.google.com/project/park-pro-active/authentication/users
2. Click "Add user"
3. Add each of the 10 users:

| Email | Password |
|-------|----------|
| admin1@parkpro.com | ParkPro2024! |
| admin2@parkpro.com | ParkPro2024! |
| manager1@parkpro.com | ParkPro2024! |
| manager2@parkpro.com | ParkPro2024! |
| user1@parkpro.com | ParkPro2024! |
| user2@parkpro.com | ParkPro2024! |
| tech1@parkpro.com | ParkPro2024! |
| tech2@parkpro.com | ParkPro2024! |
| ops1@parkpro.com | ParkPro2024! |
| ops2@parkpro.com | ParkPro2024! |

### Option 2: Automatic Script

Create `create-users.js`:

```javascript
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
  for (const user of users) {
    try {
      await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName
      });
      console.log(`✓ Created ${user.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠ ${user.email} already exists`);
      } else {
        console.error(`✗ Failed to create ${user.email}:`, error.message);
      }
    }
  }
}

createUsers().then(() => process.exit());
```

Run: `node create-users.js`

## Important Settings

In Firebase Console → Authentication → Settings:

1. **User Actions**: Enable "Email enumeration protection"
2. **Security**: Set password minimum length to 8
3. **Templates**: Customize email templates if needed

## Verify

After creating users:
1. Restart the dev server: `npm run dev`
2. Try logging in with `admin1@parkpro.com` / `ParkPro2024!`
3. Check console - the 400 error should be gone
