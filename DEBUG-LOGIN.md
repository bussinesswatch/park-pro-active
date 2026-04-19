# Debug Login Issues

## Current Error: 400 Bad Request

This means Firebase Auth rejected the login request. Common causes:

### 1. Wrong Password
**Most likely cause** - Double-check you're using exactly:
- Email: `admin1@parkpro.com`
- Password: `ParkPro2024!`

Note: Password is case-sensitive!

### 2. User Doesn't Exist in Firebase Auth
Even though we ran the script, verify the user exists:

1. Go to: https://console.firebase.google.com/project/park-pro-active/authentication/users
2. Check if `admin1@parkpro.com` is in the list
3. If not, click **"Add user"** and create it manually:
   - Email: `admin1@parkpro.com`
   - Password: `ParkPro2024!`

### 3. Firebase API Key Restrictions

Check if the API key has restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials?project=park-pro-active
2. Look for the API key ending in `lt0uc`
3. Check "Application restrictions" - should be "None" or have localhost added
4. Check "API restrictions" - should include "Identity Toolkit API"

### 4. Check Browser Console for Exact Error

Open browser console (F12) and look for the full error message after trying to login. It should show something like:
```
INVALID_PASSWORD
INVALID_EMAIL
USER_NOT_FOUND
```

### 5. Test with Firebase Console Auth Simulator

1. In Firebase Console → Authentication → Users
2. Click on `admin1@parkpro.com`
3. Click "Sign in as user" to test

### 6. Quick Fix - Reset Password

If all else fails, reset the password:

1. Firebase Console → Authentication → Users
2. Click the 3 dots next to `admin1@parkpro.com`
3. Select "Reset password"
4. Send reset email OR manually set new password
5. Try logging in with new password

### 7. Verify Firebase Config

Check that `src/config/firebase.js` has exactly:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBWbDpeguiaEyPSD8QvGWhzgwYFvBlt0uc",
  authDomain: "park-pro-active.firebaseapp.com",
  projectId: "park-pro-active",
  storageBucket: "park-pro-active.firebasestorage.app",
  messagingSenderId: "675759820649",
  appId: "1:675759820649:web:e9ce73aeceb46c095ff7f8",
  measurementId: "G-WZYD4VEXB9"
};
```

### 8. Clear Browser Cache

Sometimes old auth tokens cause issues:
- Press `Ctrl+Shift+R` to hard refresh
- Or open in Incognito/Private window
- Or clear site data in DevTools → Application → Clear storage

## Still Not Working?

Create a new user directly in Firebase Console:
1. Go to https://console.firebase.google.com/project/park-pro-active/authentication/users
2. Click "Add user"
3. Use any email and password you remember
4. Try logging in with those credentials

If that works, the issue was with the pre-configured users.

## Need Help?

Check the Firebase Auth logs:
1. Firebase Console → Authentication → Users
2. Look at "Signed In" column - when did user last sign in?
3. If never, user hasn't been successfully created yet.
