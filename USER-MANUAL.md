# Park Pro-Active - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login](#login)
3. [Dashboard](#dashboard)
4. [Asset Management](#asset-management)
5. [Maintenance Tracking](#maintenance-tracking)
6. [Inventory](#inventory)
7. [Alerts & Notifications](#alerts--notifications)
8. [Mobile App](#mobile-app)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Screen resolution: 1024x768 or higher

### Installation
The Park Pro-Active app can be installed as a Progressive Web App (PWA):

**Desktop:**
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"

**Mobile:**
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"

---

## Login

### Pre-configured Users
The system includes 10 pre-configured user accounts:

| Email | Password | Role |
|-------|----------|------|
| admin1@parkpro.com | ParkPro2024! | Administrator |
| admin2@parkpro.com | ParkPro2024! | Administrator |
| manager1@parkpro.com | ParkPro2024! | Administrator |
| manager2@parkpro.com | ParkPro2024! | Administrator |
| user1@parkpro.com | ParkPro2024! | User |
| user2@parkpro.com | ParkPro2024! | User |
| tech1@parkpro.com | ParkPro2024! | User |
| tech2@parkpro.com | ParkPro2024! | User |
| ops1@parkpro.com | ParkPro2024! | User |
| ops2@parkpro.com | ParkPro2024! | User |

### Login Steps
1. Open the app URL
2. Enter email address
3. Enter password: `ParkPro2024!`
4. Click "Sign In"

---

## Dashboard

### Overview
The dashboard provides a quick overview of your engineering operations:

- **Total Assets**: Count of all assets in the system
- **Operational**: Assets currently working
- **Non-Operational**: Assets out of service
- **Under Repair**: Assets in maintenance

### Charts
- **Asset Status Distribution**: Pie chart showing status breakdown
- **Assets by Category**: Bar chart showing count per category

### Recent Activity
- Active alerts requiring attention
- Recent maintenance logs

---

## Asset Management

### Viewing Assets
1. Click any category tab in the sidebar:
   - Gensets
   - AC Units
   - Water Plants
   - Vehicles
   - Vessels
   - Cold Storage
   - Machineries
   - Water Meters
   - Others

2. The asset list shows:
   - Asset ID
   - Name
   - Location
   - Status
   - Installation Date

### Searching & Filtering
- **Search**: Type in the search box to find by name, ID, or location
- **Status Filter**: Use dropdown to filter by Operational/Non-operational/Under Repair

### Adding a New Asset
1. Click "Add Asset" button
2. Fill in the form:
   - Asset Name (required)
   - Location (required)
   - Status
   - Installation Date
   - Manufacturer, Model, Serial Number (optional)
   - Description (optional)
3. Click "Add Asset" to save

### Editing an Asset
1. Click the pencil icon next to an asset
2. Update the fields
3. Click "Update Asset" to save

### Deleting an Asset
1. Click the trash icon next to an asset
2. Confirm deletion

### Asset Detail View
Click on an asset name or the eye icon to view details:

**Tabs:**
- **Info**: Asset specifications and details
- **Readings**: Meter readings history
- **Fuel**: Fuel consumption and refill logs
- **Maintenance**: Maintenance history

---

## Maintenance Tracking

### Adding a Reading
1. Go to asset detail → Readings tab
2. Click "Add Reading"
3. Enter:
   - Date
   - Value (number)
   - Unit (e.g., kWh, hours)
   - Notes (optional)
4. Click "Save Reading"

### Logging Maintenance
1. Go to asset detail → Maintenance tab
2. Click "Add Maintenance"
3. Enter:
   - Date
   - Maintenance Type (Preventive/Corrective/Emergency/Overhaul)
   - Technician name
   - Notes
4. Click "Save"

### Fuel Tracking
1. Go to asset detail → Fuel tab
2. Click "Add Fuel Log"
3. Enter:
   - Date
   - Type (Consumption/Refill)
   - Quantity (liters)
   - Fuel Type (Diesel/Gasoline/LPG/Other)
   - Notes
4. Click "Save"

---

## Inventory

### Viewing Inventory
1. Click "Inventory" in the sidebar
2. View all spare parts and materials
3. Low stock items are highlighted in orange

### Adding Inventory Items
1. Click "Add Item"
2. Fill in:
   - Item Name (required)
   - SKU
   - Category
   - Quantity
   - Minimum Quantity (for low stock alerts)
   - Unit (pcs, kg, L, etc.)
   - Location
   - Supplier
   - Unit Cost
   - Notes
3. Click "Add Item"

### Editing/Deleting Items
- Click pencil icon to edit
- Click trash icon to delete

---

## Alerts & Notifications

### Viewing Alerts
1. Click the bell icon in the header
2. Or click "Alerts" in the sidebar

### Alert Types
- **Maintenance Due**: Scheduled maintenance required
- **Low Fuel**: Fuel levels below threshold
- **Abnormal Readings**: Unusual meter readings
- **Inventory Low**: Spare parts below minimum quantity

### Managing Alerts
- Click ✓ to mark as read
- Click X to dismiss
- Click "Mark All Read" to clear all

### Push Notifications
Enable browser notifications:
1. Click the bell icon
2. Click "Enable Notifications"
3. Allow in browser prompt

---

## Mobile App

### Using the Mobile App
The mobile app provides:
- Dashboard overview
- Asset list and details
- Add readings on-site
- Log maintenance activities
- View inventory
- Upload photos (requires Cloudinary setup)

### Navigation
Bottom tabs:
- **Dashboard**: Overview
- **Assets**: Asset list
- **Readings**: Quick reading entry
- **Maintenance**: Log maintenance
- **Inventory**: View parts
- **Profile**: User info and logout

---

## Troubleshooting

### Cannot Log In
- Check email and password
- Ensure caps lock is off
- Try another pre-configured user account
- Contact admin if account issues persist

### Data Not Loading
- Check internet connection
- Refresh the page
- Clear browser cache (Ctrl+Shift+R)
- Check Firebase Console for outages

### Notifications Not Working
- Check browser permission settings
- Ensure notifications are enabled in app
- Try re-enabling notifications

### Offline Mode
The app works offline with cached data:
- View previously loaded assets
- See cached reports
- New data syncs when back online

### Report Issues
For technical support, contact:
- Email: support@parkpro.com
- Or create an issue in the GitHub repository

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Open search |
| Ctrl+R | Refresh data |
| Ctrl+N | Add new (context-dependent) |
| Escape | Close modal/dialog |

---

## Tips & Best Practices

1. **Regular Updates**: Log readings weekly for accurate tracking
2. **Maintenance Schedule**: Set preventive maintenance dates to avoid breakdowns
3. **Inventory Alerts**: Set minimum quantities to avoid stockouts
4. **Photo Documentation**: Upload photos of maintenance work (when Cloudinary configured)
5. **Data Export**: Export reports regularly for backup

---

## Quick Reference

**Asset Statuses:**
- 🟢 **Operational**: Working normally
- 🔴 **Non-Operational**: Out of service
- 🟡 **Under Repair**: In maintenance

**Maintenance Types:**
- Preventive: Scheduled upkeep
- Corrective: Fix issues
- Emergency: Urgent repairs
- Overhaul: Major refurbishment

**Fuel Types:**
- Diesel
- Gasoline
- LPG
- Other
