# Park Pro-Active Mobile

React Native mobile app for the Park Pro-Active Engineering Operations Management System.

## Features

- Dashboard with asset overview
- Asset management and details
- Meter readings input
- Maintenance logging
- Inventory tracking
- Offline support with AsyncStorage

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Expo CLI
- Android Studio (for Android emulator)
- Xcode (for iOS simulator, macOS only)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal with your device camera
3. The app will load in Expo Go

### Building for Production

```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## Configuration

Update `src/config/firebase.js` with your Firebase credentials before building.

## Pre-configured Users

Same as the web app:
- Default password: **ParkPro2024!**
- 10 users pre-configured (admins and regular users)
