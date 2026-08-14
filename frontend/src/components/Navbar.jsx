import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

function Navbar() {
  const { user, logout, isAuthenticated, isSeller, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    if (isAuthenticated) {
      try {
        const count = await apiFetch('/notifications/unread-count');
        setUnreadCount(count || 0);
      } catch (err) {
        // Silently ignore
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Periodically poll (every 30 seconds) or listen to custom triggers
    const interval = setInterval(fetchUnreadCount, 30000);
    window.addEventListener('notification-update', fetchUnreadCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notification-update', fetchUnreadCount);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setUnreadCount(0);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🚗 AutoTrade
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-item">Browse</Link>
          
          {isAuthenticated ? (
            <>
              {/* Buyer specific links */}
              {!isSeller && !isAdmin && (
                <>
                  <Link to="/favorites" className="nav-item">Watchlist</Link>
                  <Link to="/requests/buyer" className="nav-item">My Inquiries</Link>
                </>
              )}

              {/* Seller specific links */}
              {isSeller && (
                <>
                  <Link to="/seller/dashboard" className="nav-item">Seller Dashboard</Link>
                  <Link to="/requests/seller" className="nav-item">Received Inquiries</Link>
                  <Link to="/seller/vehicles/new" className="nav-item button-primary">List Car</Link>
                </>
              )}

              {/* Admin specific links */}
              {isAdmin && (
                <Link to="/admin/dashboard" className="nav-item">Admin Dashboard</Link>
              )}

              {/* General Authenticated links */}
              <Link to="/notifications" className="nav-item" style={{ position: 'relative' }}>
                Notifications
                {unreadCount > 0 && (
                  <span className="pill-badge primary-badge" style={{ marginLeft: '4px', position: 'absolute', top: '-10px', right: '-12px', fontSize: '0.65rem' }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              <span className="user-greeting">Hi, {user.firstName}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item btn-register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
