import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { formatPrice } from '../utils/formatters';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import { 
  Plus, 
  Car, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Image as ImageIcon, 
  Trash2, 
  Globe, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Search
} from 'lucide-react';

const FALLBACK_CAR_THUMB = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=240&q=80';

export default function SellerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Search & Filter state inside inventory
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchMyVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/vehicles/my');
      setVehicles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const handlePublish = async (vehicleId) => {
    setFeedback('');
    try {
      await apiFetch(`/vehicles/${vehicleId}/publish`, { method: 'PATCH' });
      setFeedback('Listing published successfully! It is now live on the public marketplace.');
      fetchMyVehicles();
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    }
  };

  const handleArchive = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to archive this vehicle listing? It will no longer appear in the marketplace search results.')) {
      return;
    }
    setFeedback('');
    try {
      await apiFetch(`/vehicles/${vehicleId}`, { method: 'DELETE' });
      setFeedback('Listing archived successfully.');
      fetchMyVehicles();
    } catch (err) {
      setError(err.message || 'Failed to archive listing.');
    }
  };

  const totalListings = vehicles.length;
  const publishedCount = vehicles.filter(v => v.status === 'PUBLISHED').length;
  const draftCount = vehicles.filter(v => v.status === 'DRAFT').length;

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = !searchTerm || 
      `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="workspace-page-root">
      <div className="workspace-container">
        {/* Header */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Seller Operations</div>
            <h1 className="workspace-title">Inventory Command Center</h1>
            <p className="workspace-desc">
              Manage vehicle inventory, publish draft listings, update specifications, and curate photo galleries
            </p>
          </div>
          <Link to="/seller/vehicles/new" className="btn-primary-action">
            <Plus size={16} />
            <span>List New Vehicle</span>
          </Link>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div className="toast-banner toast-success">
            <CheckCircle size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {error && (
          <div className="toast-banner toast-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Stats Grid */}
        <div className="seller-kpi-grid">
          <StatCard 
            icon={Car}
            title="Total Inventory"
            value={totalListings}
            subtitle="Registered vehicles"
            color="brand"
          />
          <StatCard 
            icon={CheckCircle2}
            title="Active on Market"
            value={publishedCount}
            subtitle="Discoverable by buyers"
            color="emerald"
          />
          <StatCard 
            icon={Clock}
            title="Draft Listings"
            value={draftCount}
            subtitle="Pending publication"
            color="amber"
          />
        </div>

        {/* Inventory Table Container */}
        <div className="inventory-card-panel">
          {/* Internal Search & Filter Bar */}
          <div className="inventory-control-bar">
            <div className="inventory-search-wrap">
              <Search size={16} className="inventory-search-icon" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Search inventory by make or model..."
                className="inventory-search-input"
              />
            </div>

            <div className="inventory-filter-pills">
              <button 
                type="button" 
                onClick={() => setStatusFilter('ALL')} 
                className={`filter-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              >
                All ({totalListings})
              </button>
              <button 
                type="button" 
                onClick={() => setStatusFilter('PUBLISHED')} 
                className={`filter-pill-btn ${statusFilter === 'PUBLISHED' ? 'active' : ''}`}
              >
                Active ({publishedCount})
              </button>
              <button 
                type="button" 
                onClick={() => setStatusFilter('DRAFT')} 
                className={`filter-pill-btn ${statusFilter === 'DRAFT' ? 'active' : ''}`}
              >
                Drafts ({draftCount})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="table-responsive-box">
              <table className="inventory-data-table">
                <thead>
                  <tr>
                    <th>Vehicle Details</th>
                    <th>Status</th>
                    <th>Asking Price</th>
                    <th>Model Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="skeleton-table-body">
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                </tbody>
              </table>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ padding: '2rem 1rem' }}>
              <EmptyState 
                icon={Car}
                title={searchTerm || statusFilter !== 'ALL' ? 'No Matching Vehicles Found' : 'No Vehicles in Your Inventory'}
                description={searchTerm || statusFilter !== 'ALL' ? 'Try clearing your search or status filter.' : 'Begin advertising your vehicle to prospective buyers nationwide.'}
                action={
                  <Link to="/seller/vehicles/new" className="btn-primary-action">
                    <Plus size={16} />
                    <span>List a Vehicle</span>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="table-responsive-box">
              <table className="inventory-data-table">
                <thead>
                  <tr>
                    <th>Vehicle Details</th>
                    <th>Status</th>
                    <th>Asking Price</th>
                    <th>Model Year</th>
                    <th>Operational Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map(v => (
                    <tr key={v.id}>
                      {/* Vehicle Cell */}
                      <td>
                        <div className="table-vehicle-cell">
                          <img 
                            src={FALLBACK_CAR_THUMB} 
                            alt={`${v.make} ${v.model}`} 
                            className="table-vehicle-thumb" 
                          />
                          <div className="table-vehicle-details">
                            <span className="table-vehicle-title">{v.make} {v.model}</span>
                            <span className="table-vehicle-specs">
                              {v.transmission} • {v.fuelType} • {v.mileage ? Number(v.mileage).toLocaleString() : '0'} mi
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={v.status} size="sm" />
                      </td>

                      {/* Price */}
                      <td>
                        <div className="table-price-text">
                          {formatPrice(v.price)}
                        </div>
                      </td>

                      {/* Year */}
                      <td>
                        <span className="table-year-cell">{v.year}</span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="table-actions-row">
                          {v.status === 'DRAFT' && (
                            <button 
                              type="button"
                              onClick={() => handlePublish(v.id)} 
                              className="btn-table-action btn-publish"
                              title="Publish vehicle to public marketplace"
                            >
                              <Globe size={13} />
                              <span>Publish</span>
                            </button>
                          )}

                          <Link 
                            to={`/vehicles/${v.id}`} 
                            className="btn-table-action"
                            title="Preview public showroom"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </Link>

                          <Link 
                            to={`/seller/vehicles/${v.id}/edit`} 
                            className="btn-table-action"
                            title="Edit vehicle details"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </Link>

                          <Link 
                            to={`/seller/vehicles/${v.id}/images`} 
                            className="btn-table-action"
                            title="Manage photo gallery"
                          >
                            <ImageIcon size={13} />
                            <span>Photos</span>
                          </Link>

                          <button 
                            type="button"
                            onClick={() => handleArchive(v.id)} 
                            className="btn-table-action btn-delete"
                            title="Archive vehicle listing"
                            aria-label="Archive listing"
                          >
                            <Trash2 size={13} />
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
      </div>
    </div>
  );
}
