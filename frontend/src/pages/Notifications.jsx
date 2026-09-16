import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Bell, 
  CheckCheck, 
  Check, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function Notifications() {
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
      window.dispatchEvent(new Event('notification-update'));
    } catch (err) {
      setError(err.message || 'Failed to resolve notification operations.');
    }
  };

  const unreadExist = notifications.some(n => !n.isRead);

  return (
    <div className="workspace-page-root">
      <div className="workspace-container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Communications</div>
            <h1 className="workspace-title">Notifications & Alerts</h1>
            <p className="workspace-desc">
              Stay updated on vehicle inquiries, listing status transitions, and moderation alerts
            </p>
          </div>
          {unreadExist && (
            <button type="button" onClick={handleMarkAllAsRead} className="btn-secondary-action">
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
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
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="You're All Caught Up"
            description="There are no pending alerts or inquiries. New messages from buyers or sellers will appear here."
          />
        ) : (
          <div className="notifications-feed-list">
            {notifications.map(n => (
              <div 
                key={n.id} 
                className={`notification-feed-item ${!n.isRead ? 'is-unread' : ''}`}
              >
                <div className="notif-icon-col">
                  <div className={`notif-icon-circle ${!n.isRead ? 'circle-active' : ''}`}>
                    <Bell size={16} />
                  </div>
                </div>

                <div className="notif-content-col">
                  <div className="notif-header-row">
                    <h3 className="notif-title">{n.title}</h3>
                    <div className="notif-time">
                      <Clock size={12} />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="notif-message">{n.content}</p>

                  {!n.isRead && (
                    <div className="notif-action-row">
                      <button 
                        type="button" 
                        onClick={() => handleMarkAsRead(n.id)} 
                        className="btn-mark-read"
                      >
                        <Check size={13} />
                        <span>Mark as read</span>
                      </button>
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
