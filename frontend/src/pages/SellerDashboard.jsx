import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

function SellerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

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
      setFeedback('Listing published successfully!');
      fetchMyVehicles();
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    }
  };

  const handleArchive = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to archive (soft delete) this listing? This action cannot be undone.')) {
      return;
    }
    setFeedback('');
    try {
      await apiFetch(`/vehicles/${vehicleId}`, { method: 'DELETE' });
      setFeedback('Listing archived successfully!');
      fetchMyVehicles();
    } catch (err) {
      setError(err.message || 'Failed to archive listing.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Manage your pre-owned vehicle listing publications</p>
        </div>
        <Link to="/seller/vehicles/new" className="btn-add-car">
          + Add New Vehicle
        </Link>
      </div>

      {feedback && <div className="success-banner">{feedback}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading your listings...</div>
      ) : vehicles.length === 0 ? (
        <div className="empty-dashboard">
          <h3>You don't have any listings yet.</h3>
          <p>Get started by listing your first car for sale!</p>
          <Link to="/seller/vehicles/new" className="btn-add-car">List Your First Car</Link>
        </div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Vehicle Info</th>
                <th>Status</th>
                <th>Price</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td>
                    <div className="table-vehicle-info">
                      <span className="table-title">{v.make} {v.model}</span>
                      <span className="table-subtitle">{v.transmission} • {v.fuelType} • {v.mileage.toLocaleString()} mi</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill pill-${v.status.toLowerCase()}`}>{v.status}</span>
                  </td>
                  <td>${v.price.toLocaleString()}</td>
                  <td>{v.year}</td>
                  <td>
                    <div className="table-actions">
                      {v.status === 'DRAFT' && (
                        <button onClick={() => handlePublish(v.id)} className="btn-table-action btn-publish">
                          Publish
                        </button>
                      )}
                      <Link to={`/seller/vehicles/${v.id}/edit`} className="btn-table-action btn-edit">
                        Edit Specs
                      </Link>
                      <Link to={`/seller/vehicles/${v.id}/images`} className="btn-table-action btn-images">
                        Manage Images
                      </Link>
                      <button onClick={() => handleArchive(v.id)} className="btn-table-action btn-archive">
                        Archive
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
  );
}

export default SellerDashboard;
