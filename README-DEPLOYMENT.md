# Park Pro-Active - Deployment Guide

## GitHub Repository
https://github.com/bussinesswatch/park-pro-active.git

## Firebase Project
- **Project ID**: `park-pro-active`
- **URL**: https://park-pro-active.firebaseapp.com

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/bussinesswatch/park-pro-active.git
```

### 2. Install Dependencies
```bash
cd park-pro-active
npm install
```

### 3. Environment Configuration
Create `.env` file with:
```
VITE_FIREBASE_API_KEY=AIzaSyBWbDpeguiaEyPSD8QvGWhzgwYFvBlt0uc
VITE_FIREBASE_AUTH_DOMAIN=park-pro-active.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=park-pro-active
VITE_FIREBASE_STORAGE_BUCKET=park-pro-active.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=675759820649
VITE_FIREBASE_APP_ID=1:675759820649:web:e9ce73aeceb46c095ff7f8
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 6. Deploy to Firebase (Alternative)
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Firebase Configuration

The Firebase project is already configured with:
- Authentication (Email/Password enabled)
- Firestore Database
- Cloud Storage
- Cloud Messaging (for notifications)
- Analytics

## Import Vessel Data

Use the JSON files created to import your vessel data:
- `vessels_import.json` - 19 vessel assets
- `maintenance_queue.json` - 7 active maintenance records
- `maintenance_history.json` - 26 maintenance logs
- `oil_change_tracker.json` - 30 oil change records

See import script example in previous messages.

## Pre-configured Users
All users have password: `ParkPro2024!`

| Email | Role |
|-------|------|
| admin1@parkpro.com | Admin |
| admin2@parkpro.com | Admin |
| manager1@parkpro.com | Admin |
| manager2@parkpro.com | Admin |
| user1@parkpro.com | User |
| user2@parkpro.com | User |
| tech1@parkpro.com | User |
| tech2@parkpro.com | User |
| ops1@parkpro.com | User |
| ops2@parkpro.com | User |

## PWA Installation
The app can be installed as a Progressive Web App on desktop and mobile for offline access.

## Features
- Real-time asset management
- Maintenance tracking
- Fuel/oil change monitoring
- Inventory management
- Push notifications
- Offline support
