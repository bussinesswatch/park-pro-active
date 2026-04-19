import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AssetsScreen from './src/screens/AssetsScreen';
import AssetDetailScreen from './src/screens/AssetDetailScreen';
import ReadingsScreen from './src/screens/ReadingsScreen';
import MaintenanceScreen from './src/screens/MaintenanceScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Auth Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Assets':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Readings':
              iconName = focused ? 'speedometer' : 'speedometer-outline';
              break;
            case 'Maintenance':
              iconName = focused ? 'construct' : 'construct-outline';
              break;
            case 'Inventory':
              iconName = focused ? 'archive' : 'archive-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Assets" component={AssetsStack} />
      <Tab.Screen name="Readings" component={ReadingsScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AssetsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AssetsList" component={AssetsScreen} options={{ title: 'Assets' }} />
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} options={{ title: 'Asset Details' }} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
