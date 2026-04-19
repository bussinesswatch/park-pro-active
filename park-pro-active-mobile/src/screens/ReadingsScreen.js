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
import { ASSET_CATEGORIES, formatDateTime } from '../utils/helpers';

const ReadingsScreen = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [readingValue, setReadingValue] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [notes, setNotes] = useState('');

  const { data: assets, loading: assetsLoading } = useCollection('assets', { realTime: true });
  const { data: readings, loading: readingsLoading, refetch, addItem } = useCollection('readings', {
    realTime: true,
    where: selectedAsset ? { field: 'assetId', operator: '==', value: selectedAsset.id } : null,
    orderBy: { field: 'date', direction: 'desc' }
  });

  const handleAddReading = async () => {
    if (!readingValue || !selectedAsset) {
      Alert.alert('Error', 'Please enter a reading value');
      return;
    }

    const result = await addItem({
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      value: parseFloat(readingValue),
      unit: unit,
      notes: notes,
      date: new Date().toISOString()
    });

    if (result.success) {
      Alert.alert('Success', 'Reading added successfully');
      setShowAddModal(false);
      setReadingValue('');
      setNotes('');
    } else {
      Alert.alert('Error', 'Failed to add reading');
    }
  };

  const renderAssetSelector = () => (
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No assets available</Text>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meter Readings</Text>
      </View>

      {renderAssetSelector()}

      {selectedAsset && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Reading</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.readingCard}>
            <View style={styles.readingHeader}>
              <Text style={styles.readingValue}>{item.value} {item.unit}</Text>
              <Text style={styles.readingDate}>{formatDateTime(item.date)}</Text>
            </View>
            {item.notes && (
              <Text style={styles.readingNotes}>{item.notes}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={readingsLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="speedometer" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {selectedAsset ? 'No readings recorded' : 'Select an asset to view readings'}
            </Text>
          </View>
        }
      />

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Reading</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Reading Value</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter value"
              keyboardType="decimal-pad"
              value={readingValue}
              onChangeText={setReadingValue}
            />

            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., kWh, hours"
              value={unit}
              onChangeText={setUnit}
            />

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter notes..."
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddReading}>
              <Text style={styles.submitButtonText}>Save Reading</Text>
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
  readingCard: {
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
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  readingDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  readingNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
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
    height: 80,
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

export default ReadingsScreen;
