import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

function BuyerRequests() {
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
    <div className="dashboard-container">
      <h1>My Listing Inquiries</h1>
      <p>Track inquiries you have sent to vehicle sellers</p>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading inquiries...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">You have not submitted any inquiries yet.</div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Message</th>
                <th>Status</th>
                <th>Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td><strong>{req.vehicleName}</strong></td>
                  <td>{req.message}</td>
                  <td>
                    <span className={`status-pill pill-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BuyerRequests;
