import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchReports = async () => {
    try {
      const data = await apiFetch('/reports/admin');
      setReports(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve administrative reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveReport = async (reportId) => {
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/reports/admin/${reportId}/resolve`, { method: 'PATCH' });
      setFeedback('Report resolved successfully.');
      fetchReports();
    } catch (err) {
      setError(err.message || 'Failed to resolve report.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Moderation Dashboard</h1>
      <p>Review and moderate reported vehicle listings</p>

      {feedback && <div className="success-banner">{feedback}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">No listings have been reported.</div>
      ) : (
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Vehicle Name</th>
                <th>Reason</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(rep => (
                <tr key={rep.id}>
                  <td>{rep.reporterName}</td>
                  <td><strong>{rep.vehicleName}</strong></td>
                  <td>
                    <span className="pill-badge primary-badge">{rep.reason}</span>
                  </td>
                  <td>{rep.description || <span style={{ color: '#64748b' }}>No details</span>}</td>
                  <td>
                    <span className={`status-pill ${rep.status === 'RESOLVED' ? 'pill-published' : 'pill-draft'}`}>
                      {rep.status}
                    </span>
                  </td>
                  <td>{new Date(rep.createdAt).toLocaleDateString()}</td>
                  <td>
                    {rep.status === 'PENDING' ? (
                      <button onClick={() => handleResolveReport(rep.id)} className="btn-table-action btn-publish">
                        Resolve
                      </button>
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

export default AdminDashboard;
