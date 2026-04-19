# Park Pro-Active

**Live URL:** https://park-pro-active.vercel.app (or your deployed URL)

Engineering Operations Management System for managing assets, maintenance, fuel consumption, and inventory.

**Current Status:** ✅ Connected to Firebase with 20 vessels, 33 maintenance logs, 30 oil records imported

## Features

- **Asset Management**: Track Gensets, AC Units, Water Plants, Vehicles, Vessels, Cold Storage, Machineries, Water Meters, and Other equipment
- **Real-time Monitoring**: Meter readings, fuel consumption, operational status
- **Maintenance Tracking**: Preventive and corrective maintenance logs
- **Inventory System**: Spare parts and materials management with low-stock alerts
- **Dashboard & Analytics**: Charts and reports for asset status, fuel usage, maintenance trends
- **Alert System**: Notifications for maintenance due, low fuel, and abnormal readings
- **Multi-user Support**: 10 pre-configured users with role-based access (Admin/User)
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Mobile**: React Native (Expo) - separate app

## Pre-configured Users

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin1@parkpro.com | ParkPro2024! | admin | Admin One |
| admin2@parkpro.com | ParkPro2024! | admin | Admin Two |
| user1@parkpro.com | ParkPro2024! | user | User One |
| user2@parkpro.com | ParkPro2024! | user | User Two |
| manager1@parkpro.com | ParkPro2024! | admin | Manager One |
| manager2@parkpro.com | ParkPro2024! | admin | Manager Two |
| tech1@parkpro.com | ParkPro2024! | user | Technician One |
| tech2@parkpro.com | ParkPro2024! | user | Technician Two |
| ops1@parkpro.com | ParkPro2024! | user | Operations One |
| ops2@parkpro.com | ParkPro2024! | user | Operations Two |

## Setup Instructions

### 1. Firebase Setup (Already Configured)

Firebase project is already configured with:
- **Project ID:** `park-pro-active`
- **Auth Domain:** `park-pro-active.firebaseapp.com`
- Authentication (Email/Password enabled)
- Firestore Database with data imported
- Cloud Messaging for notifications

To use your own Firebase:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password provider)
4. Create a Firestore database
5. Update `src/config/firebase.js` with your config

### 2. Quick Start (Local Development)

```bash
# Navigate to project
cd park-pro-active

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

**Default Login:**
- Email: `admin1@parkpro.com`
- Password: `ParkPro2024!`

### 3. Firebase Firestore Rules

Set these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Deployment

#### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deployment.

## Project Structure

```
park-pro-active/
├── src/
│   ├── components/
│   │   ├── layout/     # Layout components (Sidebar, Header)
│   │   ├── assets/     # Asset management components
│   │   ├── charts/     # Chart components
│   │   └── common/     # Shared components
│   ├── context/        # React contexts (Auth)
│   ├── hooks/          # Custom hooks (useFirestore)
│   ├── pages/          # Page components
│   ├── utils/          # Helper functions
│   └── config/         # Firebase config
├── public/             # Static assets
└── package.json
```

## Database Collections

- `users` - User profiles and roles
- `assets` - Engineering assets
- `readings` - Meter readings
- `fuel_logs` - Fuel consumption and refill logs
- `maintenance_logs` - Maintenance records
- `preventive_maintenance` - Scheduled maintenance
- `inventory` - Spare parts and materials
- `alerts` - System notifications

## Mobile App

The mobile app is built with React Native (Expo). See the `mobile` folder for the mobile application.

## License

MIT
