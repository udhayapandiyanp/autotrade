import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { TableRowSkeleton } from '../components/LoadingSkeleton';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  User,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

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
      setFeedback('Report marked as resolved successfully. Community trust updated.');
      fetchReports();
    } catch (err) {
      setError(err.message || 'Failed to resolve report.');
    }
  };

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'PENDING').length;
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="workspace-page-root">
      <div className="workspace-container">
        {/* Header */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Platform Operations</div>
            <h1 className="workspace-title">Admin Moderation Console</h1>
            <p className="workspace-desc">
              Review flagged vehicle listings, investigate violation claims, and maintain platform compliance
            </p>
          </div>
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

        {/* Operational KPI Grid */}
        <div className="seller-kpi-grid">
          <StatCard 
            icon={ShieldAlert}
            title="Total Reports"
            value={totalReports}
            subtitle="Flagged by community"
            color="brand"
          />
          <StatCard 
            icon={AlertTriangle}
            title="Pending Investigation"
            value={pendingReports}
            subtitle="Awaiting admin action"
            color="amber"
          />
          <StatCard 
            icon={CheckCircle2}
            title="Resolved Incidents"
            value={resolvedReports}
            subtitle="Moderated successfully"
            color="emerald"
          />
        </div>

        {/* Moderation Table Panel */}
        <div className="inventory-card-panel">
          {/* Status Filter Tabs */}
          <div className="inventory-control-bar">
            <div className="inventory-filter-pills">
              <button 
                type="button" 
                onClick={() => setFilterStatus('ALL')} 
                className={`filter-pill-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              >
                All Reports ({totalReports})
              </button>
              <button 
                type="button" 
                onClick={() => setFilterStatus('PENDING')} 
                className={`filter-pill-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
              >
                Pending Action ({pendingReports})
              </button>
              <button 
                type="button" 
                onClick={() => setFilterStatus('RESOLVED')} 
                className={`filter-pill-btn ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
              >
                Resolved ({resolvedReports})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="table-responsive-box">
              <table className="inventory-data-table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Flagged Vehicle</th>
                    <th>Reason</th>
                    <th>Report Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRowSkeleton cols={7} />
                  <TableRowSkeleton cols={7} />
                </tbody>
              </table>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ padding: '2rem 1rem' }}>
              <EmptyState 
                icon={ShieldCheck}
                title="Platform Clean"
                description={filterStatus !== 'ALL' ? 'No reports in this category.' : 'There are no reported listings pending administrative moderation.'}
              />
            </div>
          ) : (
            <div className="table-responsive-box">
              <table className="inventory-data-table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Flagged Vehicle</th>
                    <th>Reason</th>
                    <th>Report Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(rep => (
                    <tr key={rep.id}>
                      <td>
                        <div className="reporter-cell">
                          <User size={14} className="reporter-icon" />
                          <span>{rep.reporterName || 'Anonymous User'}</span>
                        </div>
                      </td>

                      <td>
                        <strong className="flagged-vehicle-title">{rep.vehicleName}</strong>
                      </td>

                      <td>
                        <StatusBadge status={rep.reason} size="sm" />
                      </td>

                      <td>
                        <p className="report-desc-snippet">
                          {rep.description || <em style={{ color: 'var(--text-dim)' }}>No additional details provided</em>}
                        </p>
                      </td>

                      <td>
                        <StatusBadge status={rep.status} size="sm" />
                      </td>

                      <td>
                        <div className="report-date-cell">
                          <Calendar size={13} />
                          <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td>
                        {rep.status === 'PENDING' ? (
                          <button 
                            type="button"
                            onClick={() => handleResolveReport(rep.id)} 
                            className="btn-table-action btn-publish"
                            title="Mark report as resolved"
                          >
                            <Check size={13} />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <span className="report-resolved-text">Resolved</span>
                        )}
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
