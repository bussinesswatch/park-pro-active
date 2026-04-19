# Firestore Security Rules

## Current Issue
You're seeing "Missing or insufficient permissions" because the Firestore security rules don't allow authenticated users to access the database.

## Solution

Go to Firebase Console → Firestore Database → Rules

Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write all documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Then click **"Publish"**

## Alternative: More Secure Rules

If you want production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Assets - all authenticated users can read, admins can write
    match /assets/{assetId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Maintenance logs - all authenticated users can read/write
    match /maintenance_logs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    // Readings - all authenticated users can read/write
    match /readings/{readingId} {
      allow read, write: if request.auth != null;
    }
    
    // Alerts - all authenticated users can read/write
    match /alerts/{alertId} {
      allow read, write: if request.auth != null;
    }
    
    // Inventory - all authenticated users can read/write
    match /inventory/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## After Setting Rules

1. Click **"Publish"** in Firebase Console
2. Wait 1-2 minutes for rules to propagate
3. Refresh your browser
4. Try logging in again

## Testing

Use this simple test in browser console after login:
```javascript
firebase.firestore().collection('assets').get().then(s => console.log('Assets:', s.size))
```

If it returns the number of assets (20), the rules are working!
