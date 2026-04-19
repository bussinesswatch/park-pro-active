import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../hooks/useFirestore';

const InventoryScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: items, loading, refetch } = useCollection('inventory', { realTime: true });

  const lowStockItems = items?.filter(item => item.quantity <= (item.minQuantity || 5)) || [];

  const InventoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        item.quantity <= (item.minQuantity || 5) && styles.lowStockCard
      ]}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[
          styles.quantityBadge,
          item.quantity <= (item.minQuantity || 5) && styles.lowStockBadge
        ]}>
          <Text style={[
            styles.quantityText,
            item.quantity <= (item.minQuantity || 5) && styles.lowStockText
          ]}>
            {item.quantity} {item.unit}
          </Text>
        </View>
      </View>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        {item.sku && (
          <View style={styles.detailRow}>
            <Ionicons name="barcode" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{item.sku}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
      </View>

      {lowStockItems.length > 0 && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={20} color="#f59e0b" />
          <Text style={styles.alertText}>{lowStockItems.length} items low in stock</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InventoryItem item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="archive" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No inventory items</Text>
          </View>
        }
      />

      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Category</Text>
              <Text style={styles.sectionValue}>{selectedItem?.category}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <Text style={styles.sectionValue}>
                {selectedItem?.quantity} {selectedItem?.unit}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionLabel}>Location</Text>
              <Text style={styles.sectionValue}>{selectedItem?.location}</Text>
            </View>

            {selectedItem?.supplier && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionLabel}>Supplier</Text>
                <Text style={styles.sectionValue}>{selectedItem?.supplier}</Text>
              </View>
            )}

            {selectedItem?.notes && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionLabel}>Notes</Text>
                <Text style={styles.sectionValue}>{selectedItem?.notes}</Text>
              </View>
            )}
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  alertText: {
    marginLeft: 8,
    color: '#92400e',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
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
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  quantityBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lowStockBadge: {
    backgroundColor: '#fef3c7',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  lowStockText: {
    color: '#92400e',
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    color: '#111827',
  },
});

export default InventoryScreen;
