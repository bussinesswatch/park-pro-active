import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../hooks/useFirestore';
import { ASSET_CATEGORIES } from '../utils/helpers';

const StatCard = ({ title, value, icon, color, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const CategoryCard = ({ category, count, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <Ionicons name={category.icon} size={32} color="#0ea5e9" />
    <Text style={styles.categoryCount}>{count}</Text>
    <Text style={styles.categoryName}>{category.name}</Text>
  </TouchableOpacity>
);

const DashboardScreen = ({ navigation }) => {
  const { data: assets, loading, refetch } = useCollection('assets', { realTime: true });
  const { data: alerts } = useCollection('alerts', {
    realTime: true,
    where: { field: 'read', operator: '==', value: false }
  });

  const stats = {
    total: assets?.length || 0,
    operational: assets?.filter(a => a.status === 'operational').length || 0,
    maintenance: assets?.filter(a => a.status === 'under-repair').length || 0,
    alerts: alerts?.length || 0
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Overview of your assets</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Assets"
            value={stats.total}
            icon="cube"
            color="#0ea5e9"
            onPress={() => navigation.navigate('Assets')}
          />
          <StatCard
            title="Operational"
            value={stats.operational}
            icon="checkmark-circle"
            color="#10b981"
          />
          <StatCard
            title="Under Repair"
            value={stats.maintenance}
            icon="construct"
            color="#f59e0b"
          />
          <StatCard
            title="Alerts"
            value={stats.alerts}
            icon="notifications"
            color="#ef4444"
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Readings')}
          >
            <Ionicons name="add-circle" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Add Reading</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Maintenance')}
          >
            <Ionicons name="hammer" size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Log Maintenance</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Asset Categories</Text>
        <View style={styles.categoriesGrid}>
          {ASSET_CATEGORIES.map((category) => {
            const count = assets?.filter(a => a.category === category.id).length || 0;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                count={count}
                onPress={() => navigation.navigate('Assets', { categoryId: category.id })}
              />
            );
          })}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DashboardScreen;
