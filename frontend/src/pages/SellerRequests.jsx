import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Inbox, 
  User, 
  Check, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/requests/seller');
      setRequests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve received inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status) => {
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/requests/${requestId}/status?status=${status}`, { method: 'PATCH' });
      setFeedback(`Inquiry status updated to ${status.toLowerCase()}.`);
      fetchRequests();
      window.dispatchEvent(new Event('notification-update'));
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    }
  };

  return (
    <div className="workspace-page-root">
      <div className="workspace-container">
        {/* Header */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Seller Operations</div>
            <h1 className="workspace-title">Buyer Inquiries & Leads</h1>
            <p className="workspace-desc">
              Review and respond to purchase inquiries, test drive requests, and buyer contact leads
            </p>
          </div>
          <Link to="/seller/dashboard" className="btn-secondary-action">
            <span>Inventory Dashboard</span>
            <ArrowRight size={15} />
          </Link>
        </div>

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

        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : requests.length === 0 ? (
          <EmptyState 
            icon={Inbox}
            title="No Buyer Inquiries Yet"
            description="When buyers submit questions or request an inspection on your listings, their inquiry details will arrive here in real-time."
          />
        ) : (
          <div className="inquiry-leads-list">
            {requests.map(req => (
              <div key={req.id} className="lead-inquiry-card">
                <div className="lead-header-row">
                  <div className="lead-buyer-info">
                    <div className="lead-avatar-icon">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="lead-buyer-name">{req.buyerName || 'Prospective Buyer'}</h3>
                      <div className="lead-meta-row">
                        {req.contactEmail && (
                          <span className="lead-meta-item">
                            <Mail size={12} />
                            <span>{req.contactEmail}</span>
                          </span>
                        )}
                        {req.contactPhone && (
                          <span className="lead-meta-item">
                            <Phone size={12} />
                            <span>{req.contactPhone}</span>
                          </span>
                        )}
                        <span className="lead-meta-item">
                          <Clock size={12} />
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lead-header-status">
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                {/* Target Vehicle Pill */}
                <div className="lead-vehicle-strip">
                  <span className="strip-label">Regarding:</span>
                  <strong className="strip-title">{req.vehicleName}</strong>
                  {req.vehicleId && (
                    <Link to={`/vehicles/${req.vehicleId}`} className="strip-link">
                      <span>View Showroom</span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>

                {/* Message Quote */}
                <div className="lead-message-box">
                  <p className="lead-message-text">"{req.message}"</p>
                </div>

                {/* Operational Response Actions */}
                <div className="lead-actions-bar">
                  {req.status === 'PENDING' ? (
                    <div className="lead-pending-actions">
                      <button 
                        type="button" 
                        onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} 
                        className="btn-action-accept"
                        title="Accept this inquiry"
                      >
                        <Check size={14} />
                        <span>Accept Inquiry</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => handleUpdateStatus(req.id, 'DECLINED')} 
                        className="btn-action-decline"
                        title="Decline this inquiry"
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="lead-status-summary">
                      <span>Decision finalized: <strong>{req.status}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
