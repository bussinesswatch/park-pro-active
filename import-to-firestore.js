const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./park-pro-active/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'park-pro-active'
});

const db = admin.firestore();

// Import vessels
const vessels = require('./vessels_import.json');
const maintenanceQueue = require('./maintenance_queue.json');
const maintenanceHistory = require('./maintenance_history.json');
const oilChanges = require('./oil_change_tracker.json');

async function importData() {
  console.log('Starting import to Firestore...');

  // 1. Import Vessels (Assets collection)
  console.log('\nImporting vessels to assets collection...');
  for (const vessel of vessels.assets) {
    const docRef = db.collection('assets').doc(vessel.assetId);
    await docRef.set({
      ...vessel,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  ✓ Imported ${vessel.assetId}: ${vessel.name}`);
  }

  // 2. Import Maintenance Queue
  console.log('\nImporting maintenance queue...');
  const queueBatch = db.batch();
  for (const item of maintenanceQueue.maintenance_queue) {
    const docRef = db.collection('maintenance_logs').doc();
    queueBatch.set(docRef, {
      ...item,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isQueue: true
    });
  }
  await queueBatch.commit();
  console.log(`  ✓ Imported ${maintenanceQueue.maintenance_queue.length} queue items`);

  // 3. Import Maintenance History
  console.log('\nImporting maintenance history...');
  const historyBatch = db.batch();
  for (const log of maintenanceHistory.maintenance_logs) {
    const docRef = db.collection('maintenance_logs').doc();
    historyBatch.set(docRef, {
      ...log,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  await historyBatch.commit();
  console.log(`  ✓ Imported ${maintenanceHistory.maintenance_logs.length} history logs`);

  // 4. Import Oil Change Records
  console.log('\nImporting oil change records...');
  const oilBatch = db.batch();
  for (const record of oilChanges.oil_change_records) {
    const docRef = db.collection('readings').doc();
    oilBatch.set(docRef, {
      assetId: record.vesselId,
      assetName: record.vesselName,
      type: 'oil_change',
      lastOilChangeDate: record.lastOilChangeDate,
      lastOilChangeHours: record.lastOilChangeHours,
      currentHours: record.currentHours,
      hoursUsed: record.hoursUsed,
      nextDueHours: record.nextDueHours,
      hoursToCheck: record.hoursToCheck,
      status: record.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  await oilBatch.commit();
  console.log(`  ✓ Imported ${oilChanges.oil_change_records.length} oil records`);

  // 5. Create alerts for urgent items
  console.log('\nCreating alerts for urgent items...');
  const alerts = [
    { title: 'Oil Change Due', message: 'DH-37 is 29 hours overdue for oil change', type: 'maintenance', priority: 'high', assetId: 'DH-37' },
    { title: 'Oil Change Due', message: 'DH-39 is 32 hours overdue for oil change', type: 'maintenance', priority: 'high', assetId: 'DH-39' },
    { title: 'Vessel Out of Service', message: 'VR30 is out of service and requires attention', type: 'vessel', priority: 'medium', assetId: 'VR30' }
  ];

  const alertBatch = db.batch();
  for (const alert of alerts) {
    const docRef = db.collection('alerts').doc();
    alertBatch.set(docRef, {
      ...alert,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  await alertBatch.commit();
  console.log(`  ✓ Created ${alerts.length} alerts`);

  console.log('\n✅ Import completed successfully!');
  console.log('\nSummary:');
  console.log(`  - ${vessels.assets.length} vessels imported`);
  console.log(`  - ${maintenanceQueue.maintenance_queue.length} maintenance queue items`);
  console.log(`  - ${maintenanceHistory.maintenance_logs.length} maintenance history logs`);
  console.log(`  - ${oilChanges.oil_change_records.length} oil change records`);
  console.log(`  - ${alerts.length} alerts created`);
}

importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
