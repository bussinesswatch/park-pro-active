export const ASSET_CATEGORIES = [
  { id: 'gensets', name: 'Gensets', icon: 'flash' },
  { id: 'ac-units', name: 'AC Units', icon: 'thermometer' },
  { id: 'water-plants', name: 'Water Plants', icon: 'water' },
  { id: 'vehicles', name: 'Vehicles', icon: 'car' },
  { id: 'vessels', name: 'Vessels', icon: 'boat' },
  { id: 'cold-storage', name: 'Cold Storage', icon: 'snow' },
  { id: 'machineries', name: 'Machineries', icon: 'cog' },
  { id: 'water-meters', name: 'Water Meters', icon: 'speedometer' },
  { id: 'others', name: 'Others', icon: 'cube' }
];

export const ASSET_STATUSES = [
  { value: 'operational', label: 'Operational', color: '#10b981' },
  { value: 'non-operational', label: 'Non-Operational', color: '#ef4444' },
  { value: 'under-repair', label: 'Under Repair', color: '#f59e0b' }
];

export const MAINTENANCE_TYPES = [
  { value: 'preventive', label: 'Preventive' },
  { value: 'corrective', label: 'Corrective' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'overhaul', label: 'Overhaul' }
];

export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
  }
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateAssetId = (category) => {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
};
