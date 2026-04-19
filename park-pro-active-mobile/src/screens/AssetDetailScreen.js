import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../hooks/useFirestore';
import { ASSET_STATUSES, formatDate } from '../utils/helpers';

const AssetDetailScreen = ({ route }) => {
  const { assetId } = route.params;
  const [activeTab, setActiveTab] = useState('info');

  const { data: asset } = useCollection('assets', {
    realTime: true,
    where: { field: '__name__', operator: '==', value: assetId }
  });

  const assetData = asset?.[0];
  const status = ASSET_STATUSES.find(s => s.value === assetData?.status);

  const tabs = [
    { id: 'info', label: 'Info', icon: 'information-circle' },
    { id: 'readings', label: 'Readings', icon: 'speedometer' },
    { id: 'maintenance', label: 'Maintenance', icon: 'construct' }
  ];

  if (!assetData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.assetName}>{assetData.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status?.color + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: status?.color }]} />
          <Text style={[styles.statusText, { color: status?.color }]}>
            {status?.label}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#0ea5e9' : '#6b7280'}
            />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'info' && (
          <View style={styles.infoCard}>
            <InfoRow label="Asset ID" value={assetData.assetId} />
            <InfoRow label="Location" value={assetData.location} />
            <InfoRow label="Category" value={assetData.category?.replace(/-/g, ' ')?.toUpperCase()} />
            <InfoRow label="Installation Date" value={formatDate(assetData.installDate)} />
            {assetData.manufacturer && <InfoRow label="Manufacturer" value={assetData.manufacturer} />}
            {assetData.model && <InfoRow label="Model" value={assetData.model} />}
            {assetData.serialNumber && <InfoRow label="Serial Number" value={assetData.serialNumber} />}
            {assetData.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.descriptionText}>{assetData.description}</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'readings' && (
          <AssetReadings assetId={assetId} />
        )}

        {activeTab === 'maintenance' && (
          <AssetMaintenance assetId={assetId} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const AssetReadings = ({ assetId }) => {
  const { data: readings } = useCollection('readings', {
    realTime: true,
    where: { field: 'assetId', operator: '==', value: assetId },
    orderBy: { field: 'date', direction: 'desc' }
  });

  return (
    <View>
      {readings?.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="speedometer" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No readings recorded</Text>
        </View>
      ) : (
        readings?.map((reading) => (
          <View key={reading.id} style={styles.listItem}>
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemValue}>{reading.value} {reading.unit}</Text>
              <Text style={styles.listItemDate}>{formatDate(reading.date)}</Text>
            </View>
            {reading.notes && <Text style={styles.listItemNotes}>{reading.notes}</Text>}
          </View>
        ))
      )}
    </View>
  );
};

const AssetMaintenance = ({ assetId }) => {
  const { data: logs } = useCollection('maintenance_logs', {
    realTime: true,
    where: { field: 'assetId', operator: '==', value: assetId },
    orderBy: { field: 'date', direction: 'desc' }
  });

  return (
    <View>
      {logs?.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="construct" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No maintenance records</Text>
        </View>
      ) : (
        logs?.map((log) => (
          <View key={log.id} style={styles.listItem}>
            <View style={styles.listItemHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{log.type}</Text>
              </View>
              <Text style={styles.listItemDate}>{formatDate(log.date)}</Text>
            </View>
            {log.technician && (
              <Text style={styles.technicianText}>Technician: {log.technician}</Text>
            )}
            {log.notes && <Text style={styles.listItemNotes}>{log.notes}</Text>}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  assetName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  tabLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  tabLabelActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  descriptionSection: {
    marginTop: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9ca3af',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  listItemDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  listItemNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  technicianText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default AssetDetailScreen;
