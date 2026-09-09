import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { 
  Compass, 
  Heart, 
  MessageSquare, 
  LayoutDashboard, 
  Plus, 
  ShieldAlert, 
  Bell, 
  LogOut, 
  LogIn, 
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isSeller, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    if (isAuthenticated) {
      try {
        const count = await apiFetch('/notifications/unread-count');
        setUnreadCount(count || 0);
      } catch (err) {
        // Silently ignore network issue
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
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
    navigate('/', { replace: true });
  };

  const getBrandTarget = () => {
    if (!isAuthenticated) return '/';
    if (isSeller) return '/seller/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/buyer/dashboard';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName ? user.firstName[0] : '';
    const last = user.lastName ? user.lastName[0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <header className="navbar-root">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={getBrandTarget()} className="navbar-brand" aria-label="MOLO Home">
          <img 
            src="/logo.png" 
            alt="MOLO - Buy. Sell. Move." 
            className="navbar-brand-logo" 
          />
        </Link>

        {/* Desktop Navigation Links (Only shown when authenticated) */}
        <nav className="navbar-nav-desktop" aria-label="Main Navigation">
          {isAuthenticated ? (
            <>
              {/* Buyer Links */}
              {!isSeller && !isAdmin && (
                <>
                  <NavLink 
                    to="/buyer/dashboard" 
                    className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  >
                    <Compass size={16} />
                    <span>Marketplace</span>
                  </NavLink>
                  <NavLink to="/favorites" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                    <Heart size={16} />
                    <span>Watchlist</span>
                  </NavLink>
                  <NavLink to="/requests/buyer" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={16} />
                    <span>My Inquiries</span>
                  </NavLink>
                </>
              )}

              {/* Seller Links */}
              {isSeller && (
                <>
                  <NavLink to="/seller/dashboard" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink to="/requests/seller" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={16} />
                    <span>Inquiries</span>
                  </NavLink>
                </>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                  <ShieldAlert size={16} />
                  <span>Admin Console</span>
                </NavLink>
              )}

              {/* Alerts */}
              <NavLink 
                to="/notifications" 
                className={({ isActive }) => `nav-link-item nav-link-alerts ${isActive ? 'active' : ''}`}
                title="Notifications"
              >
                <div className="alerts-icon-wrap">
                  <Bell size={16} />
                  {unreadCount > 0 && <span className="alerts-dot-pulse" />}
                </div>
                <span>Alerts</span>
                {unreadCount > 0 && (
                  <span className="alerts-badge-pill">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </NavLink>
            </>
          ) : null}
        </nav>

        {/* Right CTA / User Section */}
        <div className="navbar-right-actions">
          {isAuthenticated ? (
            <div className="user-profile-group">
              {isSeller && (
                <Link to="/seller/vehicles/new" className="btn-navbar-primary">
                  <Plus size={16} />
                  <span>List Vehicle</span>
                </Link>
              )}

              <div className="user-account-badge">
                <div className="user-avatar-disc">{getUserInitials()}</div>
                <div className="user-account-meta">
                  <span className="user-fullname">{user.firstName}</span>
                  <span className="user-role-tag">{user.role}</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleLogout} 
                className="btn-navbar-logout" 
                title="Log out of AutoTrade"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="guest-cta-group">
              <Link to="/" className="btn-navbar-primary">
                <LogIn size={15} />
                <span>Access Portal</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            type="button" 
            className="navbar-mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {isAuthenticated ? (
            <>
              {!isSeller && !isAdmin && (
                <>
                  <NavLink 
                    to="/buyer/dashboard" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Compass size={18} />
                    <span>Marketplace</span>
                  </NavLink>
                  <NavLink to="/favorites" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <Heart size={18} />
                    <span>Watchlist</span>
                  </NavLink>
                  <NavLink to="/requests/buyer" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={18} />
                    <span>My Inquiries</span>
                  </NavLink>
                </>
              )}

              {isSeller && (
                <>
                  <NavLink to="/seller/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={18} />
                    <span>Seller Dashboard</span>
                  </NavLink>
                  <NavLink to="/requests/seller" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <MessageSquare size={18} />
                    <span>Buyer Inquiries</span>
                  </NavLink>
                  <Link to="/seller/vehicles/new" className="mobile-nav-link mobile-cta-link">
                    <Plus size={18} />
                    <span>List a Vehicle for Sale</span>
                  </Link>
                </>
              )}

              {isAdmin && (
                <NavLink to="/admin/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  <ShieldAlert size={18} />
                  <span>Admin Moderation Console</span>
                </NavLink>
              )}

              <NavLink to="/notifications" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                <Bell size={18} />
                <span>Notifications & Alerts {unreadCount > 0 && `(${unreadCount})`}</span>
              </NavLink>

              <div className="mobile-user-row">
                <div className="user-avatar-disc">{getUserInitials()}</div>
                <div>
                  <div className="user-fullname">{user.firstName} {user.lastName}</div>
                  <div className="user-role-tag">{user.role}</div>
                </div>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="btn-navbar-logout" 
                  style={{ marginLeft: 'auto' }}
                  aria-label="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-guest-buttons">
              <Link to="/" className="btn-navbar-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                <LogIn size={18} />
                <span>Access Portal</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
