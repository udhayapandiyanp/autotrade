import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

function SellerRequests() {
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
      setFeedback(`Request successfully ${status.toLowerCase()}ed.`);
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Received Inquiries</h1>
      <p>Manage purchase and test drive inquiries from interested buyers</p>

      {feedback && <div className="success-banner">{feedback}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading inquiries...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">No inquiries received for your vehicle listings yet.</div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Vehicle Info</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{req.buyerName}</td>
                  <td><strong>{req.vehicleName}</strong></td>
                  <td>{req.message}</td>
                  <td>
                    <span className={`status-pill pill-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    {req.status === 'PENDING' ? (
                      <div className="table-actions">
                        <button onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} className="btn-table-action btn-publish">
                          Accept
                        </button>
                        <button onClick={() => handleUpdateStatus(req.id, 'DECLINED')} className="btn-table-action btn-archive">
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Resolved</span>
                    )}
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

export default SellerRequests;
