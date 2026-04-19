import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocument, useCollection } from '../hooks/useFirestore';
import {
  ASSET_STATUSES,
  MAINTENANCE_TYPES,
  formatDate,
  getStatusBadgeClass
} from '../utils/helpers';
import {
  ArrowLeft,
  Edit2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Wrench,
  Droplets,
  Plus,
  X,
  FileText,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';

const AssetDetail = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('readings');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const { data: asset, loading: assetLoading } = useDocument('assets', assetId);
  const { data: readings, addItem: addReading } = useCollection('readings', {
    realTime: true,
    where: { field: 'assetId', operator: '==', value: assetId },
    orderBy: { field: 'date', direction: 'desc' }
  });
  const { data: fuelLogs, addItem: addFuelLog } = useCollection('fuel_logs', {
    realTime: true,
    where: { field: 'assetId', operator: '==', value: assetId },
    orderBy: { field: 'date', direction: 'desc' }
  });
  const { data: maintenanceLogs, addItem: addMaintenanceLog } = useCollection('maintenance_logs', {
    realTime: true,
    where: { field: 'assetId', operator: '==', value: assetId },
    orderBy: { field: 'date', direction: 'desc' }
  });

  const tabs = [
    { id: 'readings', label: 'Readings', icon: Gauge },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'history', label: 'History', icon: History }
  ];

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  if (assetLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!asset) {
    return <div className="text-center py-8">Asset not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
          <p className="text-gray-500">{asset.assetId}</p>
        </div>
      </div>

      {/* Asset Info Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{asset.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Install Date</p>
              <p className="font-medium text-gray-900">{formatDate(asset.installDate, 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900 capitalize">{asset.category?.replace(/-/g, ' ')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wrench className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(asset.status)}`}>
                {ASSET_STATUSES.find(s => s.value === asset.status)?.label || asset.status}
              </span>
            </div>
          </div>
        </div>

        {asset.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-900 mt-1">{asset.description}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'readings' && (
          <ReadingsTab readings={readings} onAdd={() => openModal('reading')} assetId={assetId} />
        )}
        {activeTab === 'fuel' && (
          <FuelTab fuelLogs={fuelLogs} onAdd={() => openModal('fuel')} assetId={assetId} />
        )}
        {activeTab === 'maintenance' && (
          <MaintenanceTab maintenanceLogs={maintenanceLogs} onAdd={() => openModal('maintenance')} assetId={assetId} />
        )}
        {activeTab === 'history' && (
          <HistoryTab asset={asset} readings={readings} fuelLogs={fuelLogs} maintenanceLogs={maintenanceLogs} />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DataEntryModal
          type={modalType}
          asset={asset}
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            let result;
            if (modalType === 'reading') {
              result = await addReading({ ...data, assetId, assetName: asset.name });
            } else if (modalType === 'fuel') {
              result = await addFuelLog({ ...data, assetId, assetName: asset.name });
            } else if (modalType === 'maintenance') {
              result = await addMaintenanceLog({ ...data, assetId, assetName: asset.name });
            }
            if (result?.success) {
              toast.success('Record added successfully');
              setShowModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

const ReadingsTab = ({ readings, onAdd }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">Meter Readings</h3>
      <button onClick={onAdd} className="btn-secondary flex items-center gap-2 text-sm">
        <Plus className="w-4 h-4" />
        Add Reading
      </button>
    </div>
    {readings?.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No readings recorded</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reading Value</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {readings?.map((reading) => (
              <tr key={reading.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(reading.date)}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{reading.value} {reading.unit}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{reading.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const FuelTab = ({ fuelLogs, onAdd }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">Fuel Logs</h3>
      <button onClick={onAdd} className="btn-secondary flex items-center gap-2 text-sm">
        <Plus className="w-4 h-4" />
        Add Fuel Log
      </button>
    </div>
    {fuelLogs?.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No fuel logs recorded</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fuelLogs?.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(log.date)}</td>
                <td className="px-4 py-2 text-sm text-gray-900 capitalize">{log.type}</td>
                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{log.quantity} L</td>
                <td className="px-4 py-2 text-sm text-gray-500">{log.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const MaintenanceTab = ({ maintenanceLogs, onAdd }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">Maintenance History</h3>
      <button onClick={onAdd} className="btn-secondary flex items-center gap-2 text-sm">
        <Plus className="w-4 h-4" />
        Add Maintenance
      </button>
    </div>
    {maintenanceLogs?.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No maintenance records</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {maintenanceLogs?.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(log.date)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{log.type}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{log.technician || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{log.notes?.substring(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const HistoryTab = ({ asset, readings, fuelLogs, maintenanceLogs }) => {
  const allHistory = [
    ...(readings || []).map(r => ({ ...r, type: 'reading', label: `Reading: ${r.value} ${r.unit}` })),
    ...(fuelLogs || []).map(f => ({ ...f, type: 'fuel', label: `${f.type === 'refill' ? 'Fuel Refill' : 'Fuel Consumption'}: ${f.quantity} L` })),
    ...(maintenanceLogs || []).map(m => ({ ...m, type: 'maintenance', label: `Maintenance: ${m.type}` }))
  ].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Complete History</h3>
      {allHistory.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No history records</p>
      ) : (
        <div className="space-y-3">
          {allHistory.map((item, index) => (
            <div key={item.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.type === 'reading' ? 'bg-blue-100' :
                item.type === 'fuel' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {item.type === 'reading' ? <Gauge className="w-4 h-4 text-blue-600" /> :
                 item.type === 'fuel' ? <Fuel className="w-4 h-4 text-green-600" /> :
                 <Wrench className="w-4 h-4 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{formatDate(item.date || item.createdAt)}</p>
                {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DataEntryModal = ({ type, asset, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    unit: '',
    quantity: '',
    fuelType: 'diesel',
    logType: 'consumption',
    maintenanceType: 'preventive',
    technician: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTitle = () => {
    switch (type) {
      case 'reading': return 'Add Reading';
      case 'fuel': return 'Add Fuel Log';
      case 'maintenance': return 'Add Maintenance';
      default: return 'Add Record';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/40 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          {type === 'reading' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="input-field"
                    placeholder="Reading value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-field"
                    placeholder="e.g., kWh, hours"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'fuel' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Log Type</label>
                <select
                  value={formData.logType}
                  onChange={(e) => setFormData({ ...formData, logType: e.target.value })}
                  className="input-field"
                >
                  <option value="consumption">Fuel Consumption</option>
                  <option value="refill">Fuel Refill</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input-field"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="input-field"
                  >
                    <option value="diesel">Diesel</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="lpg">LPG</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'maintenance' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
                <select
                  value={formData.maintenanceType}
                  onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                  className="input-field"
                >
                  {MAINTENANCE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                <input
                  type="text"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  className="input-field"
                  placeholder="Technician name"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-white/40 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetDetail;
