import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../hooks/useFirestore';
import { ASSET_CATEGORIES, ASSET_STATUSES, formatDate } from '../utils/helpers';

const AssetCard = ({ asset, onPress }) => {
  const status = ASSET_STATUSES.find(s => s.value === asset.status);

  return (
    <TouchableOpacity style={styles.assetCard} onPress={() => onPress(asset)}>
      <View style={styles.assetHeader}>
        <Text style={styles.assetName}>{asset.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status?.color + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: status?.color }]} />
          <Text style={[styles.statusText, { color: status?.color }]}>
            {status?.label}
          </Text>
        </View>
      </View>
      <Text style={styles.assetId}>{asset.assetId}</Text>
      <View style={styles.assetDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{asset.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={14} color="#6b7280" />
          <Text style={styles.detailText}>{formatDate(asset.installDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AssetsScreen = ({ navigation, route }) => {
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: assets, loading, refetch } = useCollection('assets', {
    realTime: true,
    where: categoryId ? { field: 'category', operator: '==', value: categoryId } : null
  });

  const filteredAssets = useMemo(() => {
    return assets?.filter(asset => {
      const matchesSearch = asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.assetId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchQuery, statusFilter]);

  const category = ASSET_CATEGORIES.find(c => c.id === categoryId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{category?.name || 'All Assets'}</Text>
        <Text style={styles.headerSubtitle}>{filteredAssets?.length || 0} assets</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {ASSET_STATUSES.map(status => (
          <TouchableOpacity
            key={status.value}
            style={[styles.filterChip, statusFilter === status.value && styles.filterChipActive]}
            onPress={() => setStatusFilter(status.value)}
          >
            <Text style={[styles.filterText, statusFilter === status.value && styles.filterTextActive]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssetCard
            asset={item}
            onPress={(asset) => navigation.navigate('AssetDetail', { assetId: asset.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No assets found</Text>
          </View>
        }
      />
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
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0ea5e9',
  },
  filterText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  assetCard: {
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
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  assetId: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  assetDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
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
});

export default AssetsScreen;
