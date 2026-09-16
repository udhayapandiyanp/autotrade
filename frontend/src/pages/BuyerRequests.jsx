import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import RequestTimeline from '../components/RequestTimeline';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  MessageSquare, 
  Car, 
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Clock 
} from 'lucide-react';

export default function BuyerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiFetch('/requests/buyer');
        setRequests(data || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve your inquiries.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="workspace-page-root">
      <div className="workspace-container">
        {/* Header */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Buyer Workspace</div>
            <h1 className="workspace-title">My Vehicle Inquiries</h1>
            <p className="workspace-desc">
              Track responses from sellers, test drive scheduling, and purchase inquiries
            </p>
          </div>
          <Link to="/buyer/dashboard" className="btn-secondary-action">
            <Car size={16} />
            <span>Browse Inventory</span>
          </Link>
        </div>

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
            icon={MessageSquare}
            title="No Inquiries Sent Yet"
            description="You have not reached out to any sellers yet. Discover vehicles on the marketplace and send direct inquiry messages."
            action={
              <Link to="/buyer/dashboard" className="btn-primary-action">
                <span>Explore Vehicles</span>
                <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="inquiry-journey-list">
            {requests.map(req => (
              <div key={req.id} className="inquiry-journey-card">
                <div className="journey-card-header">
                  <div className="journey-vehicle-info">
                    <h3 className="journey-vehicle-title">{req.vehicleName}</h3>
                    <div className="journey-timestamp">
                      <Clock size={13} />
                      <span>Sent on {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="journey-header-right">
                    <StatusBadge status={req.status} />
                    <Link to={`/vehicles/${req.vehicleId}`} className="btn-secondary-action btn-sm">
                      <span>View Vehicle</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>

                {/* Visual Lifecycle Progression Timeline */}
                <div className="journey-timeline-wrapper">
                  <RequestTimeline status={req.status} date={req.createdAt} />
                </div>

                {/* Inquiry Message Body */}
                <div className="journey-message-bubble">
                  <div className="bubble-label">Your Message to Seller:</div>
                  <p className="bubble-text">"{req.message}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
