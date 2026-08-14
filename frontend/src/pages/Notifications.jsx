import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch('/notifications');
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notifId) => {
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/notifications/${notifId}/read`, { method: 'PATCH' });
      fetchNotifications();
      // Dispatch event to update unread badge count in Navbar
      window.dispatchEvent(new Event('notification-update'));
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    setError('');
    setFeedback('');
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' });
      setFeedback('All notifications marked as read.');
      fetchNotifications();
      // Update Navbar count
      window.dispatchEvent(new Event('notification-update'));
    } catch (err) {
      setError(err.message || 'Failed to resolve notification operations.');
    }
  };

  return (
    <div className="manager-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="manager-header">
        <h2>Notifications</h2>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllAsRead} className="btn-add-img" style={{ background: '#10b981' }}>
            Mark All Read
          </button>
        )}
      </div>

      {feedback && <div className="success-banner">{feedback}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">You do not have any notifications.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          {notifications.map(n => (
            <div 
              key={n.id} 
              className="info-box" 
              style={{
                borderLeft: n.isRead ? '2px solid rgba(255, 255, 255, 0.05)' : '4px solid #3b82f6',
                background: n.isRead ? 'rgba(15, 23, 42, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ color: n.isRead ? '#cbd5e1' : '#f8fafc', marginBottom: '0.25rem' }}>{n.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{n.content}</p>
                <small style={{ color: '#64748b' }}>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              {!n.isRead && (
                <button 
                  onClick={() => handleMarkAsRead(n.id)} 
                  className="btn-table-action btn-edit"
                  style={{ whiteSpace: 'nowrap', marginLeft: '1.5rem' }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
