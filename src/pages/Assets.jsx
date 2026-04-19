import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  getStatusBadgeClass,
  formatDate,
  generateAssetId
} from '../utils/helpers';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Wrench,
  Fuel,
  Gauge,
  Droplets,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Assets = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const category = ASSET_CATEGORIES.find(c => c.id === categoryId);

  const { data: assets, loading, addItem, updateItem, deleteItem } = useCollection('assets', {
    realTime: true,
    where: categoryId ? { field: 'category', operator: '==', value: categoryId } : null
  });

  const filteredAssets = useMemo(() => {
    return assets?.filter(asset => {
      const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  const handleAdd = async (formData) => {
    const result = await addItem({
      ...formData,
      category: categoryId,
      assetId: generateAssetId(categoryId)
    });
    if (result.success) {
      toast.success('Asset added successfully');
      setShowModal(false);
    } else {
      toast.error('Failed to add asset');
    }
  };

  const handleUpdate = async (id, formData) => {
    const result = await updateItem(id, formData);
    if (result.success) {
      toast.success('Asset updated successfully');
      setSelectedAsset(null);
      setShowModal(false);
    } else {
      toast.error('Failed to update asset');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    const result = await deleteItem(id);
    if (result.success) {
      toast.success('Asset deleted successfully');
    } else {
      toast.error('Failed to delete asset');
    }
  };

  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const openAddModal = () => {
    setSelectedAsset(null);
    setShowModal(true);
  };

  if (!category && categoryId) {
    return <div className="text-center py-8">Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {category ? category.name : 'All Assets'}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage {category ? category.name.toLowerCase() : 'all engineering assets'}
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Status</option>
              {ASSET_STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredAssets?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No assets found. Click "Add Asset" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Install Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets?.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.assetId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{asset.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{asset.location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(asset.status)}`}>
                        {ASSET_STATUSES.find(s => s.value === asset.status)?.label || asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(asset.installDate, 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/asset/${asset.id}`)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(asset)}
                          className="p-1 hover:bg-gray-100 rounded text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AssetModal
          asset={selectedAsset}
          categoryId={categoryId}
          onClose={() => setShowModal(false)}
          onSubmit={selectedAsset ? (data) => handleUpdate(selectedAsset.id, data) : handleAdd}
        />
      )}
    </div>
  );
};

const AssetModal = ({ asset, categoryId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    location: asset?.location || '',
    status: asset?.status || 'operational',
    installDate: asset?.installDate || new Date().toISOString().split('T')[0],
    description: asset?.description || '',
    manufacturer: asset?.manufacturer || '',
    model: asset?.model || '',
    serialNumber: asset?.serialNumber || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{asset ? 'Edit Asset' : 'Add Asset'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/40 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter asset name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input-field"
              placeholder="Enter location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                {ASSET_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
              <input
                type="date"
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="input-field"
                placeholder="Manufacturer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="input-field"
                placeholder="Model"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              className="input-field"
              placeholder="Serial Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Enter description..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-white/40 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {asset ? 'Update' : 'Add'} Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assets;
