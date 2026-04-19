# Import Data to Firestore

## Step 1: Get Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/project/park-pro-active/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in this folder (next to `import-to-firestore.js`)

## Step 2: Install Dependencies

```bash
cd "c:\Users\maushaz.MADIHAA\Desktop\Rettey\park_pro_active"
npm install
```

## Step 3: Run Import

```bash
npm run import
```

## What Gets Imported

### 1. Assets Collection (19 vessels)
- All vessel details (VR30, VR34, VR37, VR38, VR42, VR51, VV17, VV18, VV09, VD28, VD37, VD38, VD39, VD43, VD49, VD58, VD60, VD62, VD64, VD67)
- Status, location, engine specs, fuel type
- Issues and action items

### 2. Maintenance Logs Collection
- 7 active maintenance queue items
- 26 maintenance history logs (dating back to Feb 2021)

### 3. Readings Collection
- 30 oil change tracking records
- Hours, status, next due calculations

### 4. Alerts Collection
- 3 automatic alerts:
  - DH-37: Oil change overdue (29 hrs)
  - DH-39: Oil change overdue (32 hrs)
  - VR30: Vessel out of service

## Firestore Database Structure

```
assets/
  VR30, VR34, VR37, ... (19 vessels)

maintenance_logs/
  [auto-generated IDs]
  - type, assetId, assetName
  - issueDescription, actionTaken
  - technician, status, date

readings/
  [auto-generated IDs]
  - type: 'oil_change'
  - assetId, assetName
  - hours data

alerts/
  [auto-generated IDs]
  - title, message, type
  - priority, read: false
```

## Security Rules

After import, set these Firestore security rules in Firebase Console:

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

## Troubleshooting

**Error: "Cannot find module './serviceAccountKey.json'"**
- Make sure you downloaded and renamed the service account key
- Place it in the same folder as the import script

**Error: "Permission denied"**
- Verify your Firebase project ID is correct: `park-pro-active`
- Check that Firestore is enabled in your project

**Error: "already exists"**
- The script uses set() which overwrites existing documents
- To start fresh, delete collections in Firebase Console first

## Verify Import

After running the import:
1. Go to Firebase Console → Firestore Database
2. You should see 4 collections: `assets`, `maintenance_logs`, `readings`, `alerts`
3. Check that assets have IDs like VR30, VR34, etc.
4. Total documents: ~58 records
