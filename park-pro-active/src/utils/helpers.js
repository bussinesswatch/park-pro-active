import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date.toDate ? date.toDate() : new Date(date);
  return isValid(parsed) ? format(parsed, formatStr) : 'Invalid Date';
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
};

export const calculateFuelEfficiency = (fuelUsed, hours) => {
  if (!hours || hours === 0) return 0;
  return (fuelUsed / hours).toFixed(2);
};

export const getStatusColor = (status) => {
  const colors = {
    'operational': 'bg-green-500',
    'non-operational': 'bg-red-500',
    'under-repair': 'bg-yellow-500',
    'maintenance-due': 'bg-orange-500',
    'low-fuel': 'bg-red-400'
  };
  return colors[status] || 'bg-gray-500';
};

export const getStatusBadgeClass = (status) => {
  const classes = {
    'operational': 'bg-green-100 text-green-800 border-green-200',
    'non-operational': 'bg-red-100 text-red-800 border-red-200',
    'under-repair': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'maintenance-due': 'bg-orange-100 text-orange-800 border-orange-200',
    'low-fuel': 'bg-red-50 text-red-700 border-red-200'
  };
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const ASSET_CATEGORIES = [
  { id: 'gensets', name: 'Gensets', icon: 'Zap' },
  { id: 'ac-units', name: 'AC Units', icon: 'Wind' },
  { id: 'water-plants', name: 'Water Plants', icon: 'Droplets' },
  { id: 'vehicles', name: 'Vehicles', icon: 'Car' },
  { id: 'vessels', name: 'Vessels', icon: 'Ship' },
  { id: 'cold-storage', name: 'Cold Storage', icon: 'Snowflake' },
  { id: 'machineries', name: 'Machineries', icon: 'Cog' },
  { id: 'water-meters', name: 'Water Meters', icon: 'Gauge' },
  { id: 'others', name: 'Others', icon: 'Package' }
];

export const ASSET_STATUSES = [
  { value: 'operational', label: 'Operational' },
  { value: 'non-operational', label: 'Non-Operational' },
  { value: 'under-repair', label: 'Under Repair' }
];

export const MAINTENANCE_TYPES = [
  { value: 'preventive', label: 'Preventive Maintenance' },
  { value: 'corrective', label: 'Corrective Maintenance' },
  { value: 'emergency', label: 'Emergency Repair' },
  { value: 'overhaul', label: 'Overhaul' }
];

export const generateAssetId = (category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const calculateDaysUntil = (date) => {
  if (!date) return null;
  const target = typeof date === 'string' ? parseISO(date) : date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
