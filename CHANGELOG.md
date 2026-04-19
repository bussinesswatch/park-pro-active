# Changelog

All notable changes to the Park Pro-Active project will be documented in this file.

## [1.0.0] - 2026-04-19

### Added
- Initial release of Park Pro-Active Engineering Operations Management System
- **Web Application**: React + Vite + Tailwind CSS frontend
- **Mobile Application**: React Native (Expo) for iOS and Android
- **Firebase Backend**: Firestore database, Authentication, Cloud Messaging
- **Asset Management**: Support for 9 asset categories:
  - Gensets
  - AC Units
  - Water Plants
  - Vehicles
  - Vessels (with full vessel fleet imported)
  - Cold Storage
  - Machineries
  - Water Meters
  - Others
- **User Authentication**: 
  - 10 pre-configured users with role-based access (Admin/User)
  - Firebase Email/Password authentication
- **Dashboard**: 
  - Real-time statistics (Total, Operational, Non-operational, Under Repair)
  - Pie charts for status distribution
  - Bar charts for category breakdown
  - Recent maintenance activity feed
  - Active alerts display
- **Asset Tracking**:
  - Asset CRUD operations
  - Location tracking
  - Status management (Operational/Non-operational/Under Repair)
  - Installation date tracking
  - Search and filter functionality
- **Maintenance Module**:
  - Maintenance logging (Preventive, Corrective, Emergency, Overhaul)
  - Maintenance history tracking
  - Technician assignment
  - Spare parts tracking
  - Downtime calculation
- **Fuel & Oil Tracking**:
  - Fuel consumption logs
  - Fuel refill tracking
  - Oil change monitoring with hours-based alerts
  - Engine hours tracking for twin-engine vessels
- **Inventory System**:
  - Spare parts management
  - Category-based organization
  - Low stock alerts
  - Supplier tracking
  - Usage history
- **Alert System**:
  - Real-time alerts for maintenance due
  - Low fuel/oil alerts
  - Inventory low stock alerts
  - Abnormal reading detection
  - Push notifications via Firebase Cloud Messaging
- **PWA Support**:
  - Installable as Progressive Web App
  - Offline functionality with service worker
  - Background sync
  - Cache management
- **Notification System**:
  - Browser push notifications
  - In-app notification panel
  - Real-time updates via Firestore
  - Mark as read/dismiss functionality
- **Vessel Fleet Import**:
  - 20 vessels imported from weekly status report
  - Maintenance queue (7 active items)
  - Maintenance history (26 historical logs)
  - Oil change tracker (30 records)
  - Automatic alerts for overdue maintenance

### Vessel Data
- **Villa Roalhi Fleet**: VR30, VR34, VR37, VR38, VR42, VR51
- **Villa Vaali Fleet**: VV09, VV17, VV18
- **Villa Dhuveli Fleet**: VD28, VD37, VD38, VD39, VD43, VD49, VD58, VD60, VD62, VD64, VD67
- Status tracking: 13 operational, 2 under maintenance, 5 out of service

### Technical Stack
- **Frontend**: React 18.2, Vite 5.0, Tailwind CSS 3.4
- **Backend**: Firebase (Firestore, Auth, Storage, Messaging)
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **Mobile**: React Native 0.73, Expo 50.0
- **Date Handling**: date-fns 3.0
- **Notifications**: Firebase Cloud Messaging

### Security
- Firebase Authentication with email/password
- Firestore security rules for authenticated access
- Service account key for server-side operations

### Documentation
- Comprehensive User Manual
- Setup and Deployment Guide
- Import Instructions for vessel data
- API documentation via code comments

## [0.9.0] - 2026-04-18 (Beta)

### Added
- Core application structure
- Firebase configuration
- Authentication system prototype
- Basic asset management
- Dashboard layout

### Changed
- Updated to Vite 5.0
- Migrated to Tailwind CSS 3.4

### Fixed
- Initial build configuration issues
- Routing setup for React Router 6

---

## Future Roadmap

### Planned for v1.1.0
- [ ] Photo upload integration (Cloudinary)
- [ ] Advanced reporting with PDF export
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced search with filters
- [ ] Bulk import/export via CSV
- [ ] Calendar view for maintenance scheduling
- [ ] Cost analysis and budgeting

### Planned for v1.2.0
- [ ] QR code scanning for asset lookup
- [ ] Geolocation tracking for vehicles/vessels
- [ ] Integration with IoT sensors
- [ ] Automated maintenance scheduling
- [ ] Advanced analytics dashboard
- [ ] Mobile app offline sync improvements
- [ ] Team chat/communication
- [ ] Vendor management module

### Planned for v2.0.0
- [ ] Multi-tenant support
- [ ] White-label customization
- [ ] API for third-party integrations
- [ ] Advanced workflow automation
- [ ] Predictive maintenance with AI
- [ ] Mobile app native features
- [ ] Desktop application (Electron)

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Added functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Support

For issues or feature requests:
- GitHub: https://github.com/bussinesswatch/park-pro-active
- Email: support@parkpro.com
