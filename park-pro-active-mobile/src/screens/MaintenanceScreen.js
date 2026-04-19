import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../hooks/useFirestore';
import { MAINTENANCE_TYPES, formatDateTime } from '../utils/helpers';

const MaintenanceScreen = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [maintenanceType, setMaintenanceType] = useState('preventive');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');

  const { data: assets } = useCollection('assets', { realTime: true });
  const { data: maintenanceLogs, loading, refetch, addItem } = useCollection('maintenance_logs', {
    realTime: true,
    where: selectedAsset ? { field: 'assetId', operator: '==', value: selectedAsset.id } : null,
    orderBy: { field: 'date', direction: 'desc' }
  });

  const handleAddMaintenance = async () => {
    if (!selectedAsset) {
      Alert.alert('Error', 'Please select an asset');
      return;
    }

    const result = await addItem({
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      type: MAINTENANCE_TYPES.find(t => t.value === maintenanceType)?.label,
      technician: technician,
      notes: notes,
      date: new Date().toISOString()
    });

    if (result.success) {
      Alert.alert('Success', 'Maintenance log added successfully');
      setShowAddModal(false);
      setTechnician('');
      setNotes('');
    } else {
      Alert.alert('Error', 'Failed to add maintenance log');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance</Text>
      </View>

      <View style={styles.assetSelector}>
        <Text style={styles.sectionTitle}>Select Asset</Text>
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.assetChip,
                selectedAsset?.id === item.id && styles.assetChipActive
              ]}
              onPress={() => setSelectedAsset(item)}
            >
              <Text style={[
                styles.assetChipText,
                selectedAsset?.id === item.id && styles.assetChipTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedAsset && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Log Maintenance</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={maintenanceLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <Text style={styles.maintenanceDate}>{formatDateTime(item.date)}</Text>
            </View>
            <Text style={styles.assetName}>{item.assetName}</Text>
            {item.technician && (
              <View style={styles.technicianRow}>
                <Ionicons name="person" size={14} color="#6b7280" />
                <Text style={styles.technicianText}>{item.technician}</Text>
              </View>
            )}
            {item.notes && (
              <Text style={styles.notesText}>{item.notes}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {selectedAsset ? 'No maintenance records' : 'Select an asset to view maintenance'}
            </Text>
          </View>
        }
      />

      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Maintenance</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Maintenance Type</Text>
            <View style={styles.typeContainer}>
              {MAINTENANCE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    maintenanceType === type.value && styles.typeButtonActive
                  ]}
                  onPress={() => setMaintenanceType(type.value)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    maintenanceType === type.value && styles.typeButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Technician</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter technician name"
              value={technician}
              onChangeText={setTechnician}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter maintenance notes..."
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddMaintenance}>
              <Text style={styles.submitButtonText}>Save Maintenance Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  assetSelector: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  assetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  assetChipActive: {
    backgroundColor: '#0ea5e9',
  },
  assetChipText: {
    fontSize: 14,
    color: '#374151',
  },
  assetChipTextActive: {
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  maintenanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  maintenanceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  technicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  technicianText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MaintenanceScreen;
