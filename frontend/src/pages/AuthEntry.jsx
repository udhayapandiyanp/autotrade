import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Store, 
  ShieldAlert, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const ROLES = [
  {
    id: 'BUYER',
    name: 'Buyer',
    tagline: 'Discover & Inquire',
    icon: Compass,
    color: 'blue',
    description: 'Browse verified inventory, filter powertrain specs, save favorites, and dispatch direct purchase inquiries to sellers.',
    features: ['Verified Pre-Owned Specs', 'Direct Seller Inquiries', 'Custom Watchlists'],
    badge: 'Marketplace Access'
  },
  {
    id: 'SELLER',
    name: 'Seller',
    tagline: 'List & Liquidate',
    icon: Store,
    color: 'emerald',
    description: 'List vehicles, manage active listings, review buyer inquiries, and manage technical vehicle specifications and image galleries.',
    features: ['Zero Listing Commissions', 'Real-Time Lead Tracking', 'Photo & Spec Studio'],
    badge: 'Inventory Console'
  },
  {
    id: 'ADMIN',
    name: 'Admin',
    tagline: 'Platform Governance',
    icon: ShieldAlert,
    color: 'violet',
    description: 'Manage users, inspect vehicles, investigate compliance reports, and oversee platform operations.',
    features: ['Listing Moderation', 'Report Investigation', 'Platform Controls'],
    badge: 'Restricted Access'
  }
];

export default function AuthEntry({ defaultMode = 'login', initialRole = null }) {
  const { user, login, register, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read URL search params if present: ?role=buyer|seller|admin&mode=login|register
  const queryParams = new URLSearchParams(location.search);
  const queryRole = queryParams.get('role')?.toUpperCase();
  const queryMode = queryParams.get('mode');

  const [selectedRole, setSelectedRole] = useState(() => {
    if (['BUYER', 'SELLER', 'ADMIN'].includes(queryRole)) return queryRole;
    if (['BUYER', 'SELLER', 'ADMIN'].includes(initialRole)) return initialRole;
    return null;
  });

  const [mode, setMode] = useState(() => {
    if (queryMode === 'register' || defaultMode === 'register') return 'register';
    return 'login';
  });

  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already authenticated, immediately route to the authenticated role's dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'SELLER') {
        navigate('/seller/dashboard', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/buyer/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle role selection
  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
    setError('');
    setSuccess('');
    // Admin does not have public registration
    if (roleId === 'ADMIN') {
      setMode('login');
    }
  };

  // Switch role back to picker
  const handleResetRole = () => {
    setSelectedRole(null);
    setError('');
    setSuccess('');
  };

  // Form submission: Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const authenticatedUser = await login(email, password);

        // Security role verification: Backend role is the single source of truth
        const actualRole = authenticatedUser?.role;

        // If user attempted to log in under Admin portal without ADMIN privilege
        if (selectedRole === 'ADMIN' && actualRole !== 'ADMIN') {
          logout();
          throw new Error('Access denied: This account lacks platform administrative privileges.');
        }

        // Route strictly to the backend-authenticated role dashboard
        if (actualRole === 'SELLER') {
          navigate('/seller/dashboard', { replace: true });
        } else if (actualRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/buyer/dashboard', { replace: true });
        }
      } else {
        // Registration (Buyer or Seller only; Admin is blocked by UI & backend)
        if (selectedRole === 'ADMIN') {
          throw new Error('Public registration as Administrator is not permitted.');
        }

        await register({
          email,
          password,
          firstName,
          lastName,
          phone,
          role: selectedRole,
        });

        setSuccess(`Account registered as ${selectedRole}! Please sign in below.`);
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please review your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleObj = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="auth-entry-root">
      <div className="auth-entry-background" />

      <div className="auth-entry-container">
        {/* Top Brand Anchor */}
        <header className="auth-entry-header">
          <Link to="/" className="auth-entry-logo-anchor" aria-label="MOLO Home">
            <img 
              src="/logo.png" 
              alt="MOLO - Buy. Sell. Move." 
              className="auth-portal-logo" 
            />
          </Link>
          <div className="auth-entry-badge-pill">
            <ShieldCheck size={14} className="text-brand" />
            <span>Automotive Enterprise Platform</span>
          </div>
        </header>

        {/* =====================================================================
            STAGE 1: Role Selection Screen (When no role has been chosen yet)
            ===================================================================== */}
        {!selectedRole ? (
          <section className="role-selection-section" aria-label="Choose Your Role">
            <div className="role-selection-headings">
              <h1 className="role-selection-title">Select Your Access Portal</h1>
              <p className="role-selection-desc">
                Choose your operational portal to enter MOLO’s verified vehicle marketplace, seller inventory command, or platform governance.
              </p>
            </div>

            <div className="role-cards-grid">
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r.id)}
                    className={`role-select-card role-card-${r.color}`}
                    id={`role-card-${r.id.toLowerCase()}`}
                  >
                    <div className="role-card-header">
                      <div className={`role-card-icon-wrap icon-wrap-${r.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className="role-card-badge">{r.badge}</span>
                    </div>

                    <div className="role-card-body">
                      <h2 className="role-card-name">{r.name}</h2>
                      <span className="role-card-tagline">{r.tagline}</span>
                      <p className="role-card-description">{r.description}</p>
                    </div>

                    <div className="role-card-features">
                      {r.features.map((feat, idx) => (
                        <div key={idx} className="role-feature-item">
                          <span className="feature-dot" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="role-card-footer">
                      <span className="role-card-action-text">Continue to {r.name}</span>
                      <ArrowRight size={16} className="role-card-arrow" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          /* =====================================================================
             STAGE 2: Authentication Interface (For the selected role)
             ===================================================================== */
          <section className="auth-portal-section" aria-label={`${activeRoleObj?.name} Portal Authentication`}>
            <div className="auth-portal-card">
              {/* Back to Role Selection Control Bar */}
              <div className="auth-portal-nav-bar">
                <button
                  type="button"
                  onClick={handleResetRole}
                  className="btn-back-role-select"
                  id="btn-switch-role"
                >
                  <ArrowLeft size={16} />
                  <span>Choose Different Portal</span>
                </button>

                <div className={`portal-status-pill pill-${activeRoleObj?.color}`}>
                  {activeRoleObj && <activeRoleObj.icon size={14} />}
                  <span>{activeRoleObj?.name} Portal</span>
                </div>
              </div>

              {/* Portal Header */}
              <div className="auth-portal-header">
                <h2 className="auth-portal-title">
                  {mode === 'login' ? `Sign In to ${activeRoleObj?.name} Portal` : `Create ${activeRoleObj?.name} Account`}
                </h2>
                <p className="auth-portal-subtitle">
                  {selectedRole === 'ADMIN'
                    ? 'Authorized platform administration console. Public registration is restricted.'
                    : mode === 'login'
                    ? `Enter your credentials to access your verified ${activeRoleObj?.name.toLowerCase()} workspace.`
                    : `Register as an authorized ${activeRoleObj?.name.toLowerCase()} on MOLO.`}
                </p>
              </div>

              {/* Mode Toggle Tabs (Only for Buyer & Seller; Admin is login-only) */}
              {selectedRole !== 'ADMIN' && (
                <div className="auth-mode-segmented-control" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'login'}
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`mode-segment-btn ${mode === 'login' ? 'active' : ''}`}
                    id="tab-sign-in"
                  >
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'register'}
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`mode-segment-btn ${mode === 'register' ? 'active' : ''}`}
                    id="tab-register"
                  >
                    <UserPlus size={15} />
                    <span>Create Account</span>
                  </button>
                </div>
              )}

              {/* Feedback Alerts */}
              {error && (
                <div className="toast-banner toast-error" role="alert" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="toast-banner toast-success" role="status" style={{ marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={18} />
                  <span>{success}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="auth-portal-form">
                {/* Registration-only Fields */}
                {mode === 'register' && selectedRole !== 'ADMIN' && (
                  <>
                    <div className="form-two-cols">
                      <div className="form-group-unit">
                        <label className="unit-label" htmlFor="reg-first-name">First Name</label>
                        <div className="auth-input-container">
                          <User size={16} className="auth-field-icon" />
                          <input
                            id="reg-first-name"
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Alex"
                            className="auth-input-field"
                          />
                        </div>
                      </div>

                      <div className="form-group-unit">
                        <label className="unit-label" htmlFor="reg-last-name">Last Name</label>
                        <div className="auth-input-container">
                          <User size={16} className="auth-field-icon" />
                          <input
                            id="reg-last-name"
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Morgan"
                            className="auth-input-field"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group-unit" style={{ marginBottom: '1rem' }}>
                      <label className="unit-label" htmlFor="reg-phone">Phone Number (Optional)</label>
                      <div className="auth-input-container">
                        <Phone size={16} className="auth-field-icon" />
                        <input
                          id="reg-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555-0199"
                          className="auth-input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Shared Login & Registration Credentials */}
                <div className="form-group-unit" style={{ marginBottom: '1rem' }}>
                  <label className="unit-label" htmlFor="auth-email">Email Address</label>
                  <div className="auth-input-container">
                    <Mail size={16} className="auth-field-icon" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'ADMIN' 
                          ? 'admin@dev.local' 
                          : selectedRole === 'SELLER' 
                          ? 'seller@dev.local' 
                          : 'buyer@dev.local'
                      }
                      className="auth-input-field"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group-unit" style={{ marginBottom: '1.5rem' }}>
                  <label className="unit-label" htmlFor="auth-password">Password</label>
                  <div className="auth-input-container">
                    <Lock size={16} className="auth-field-icon" />
                    <input
                      id="auth-password"
                      type="password"
                      required
                      minLength={mode === 'register' ? 6 : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input-field"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>
                </div>

                {/* Admin Security Banner */}
                {selectedRole === 'ADMIN' && (
                  <div className="admin-security-notice">
                    <ShieldAlert size={16} className="text-amber" />
                    <span>
                      Administrative accounts require authorized internal provisioning. Access attempts are recorded.
                    </span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-portal-submit btn-portal-${activeRoleObj?.color}`}
                  id="btn-auth-submit"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : mode === 'login' ? (
                    <>
                      <LogIn size={17} />
                      <span>Sign In as {activeRoleObj?.name}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      <span>Create {activeRoleObj?.name} Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switch Link */}
              {selectedRole !== 'ADMIN' && (
                <div className="auth-portal-card-footer">
                  {mode === 'login' ? (
                    <span>
                      Don't have a {activeRoleObj?.name.toLowerCase()} account?{' '}
                      <button
                        type="button"
                        onClick={() => { setMode('register'); setError(''); }}
                        className="auth-footer-action-btn"
                      >
                        Register here
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); }}
                        className="auth-footer-action-btn"
                      >
                        Sign in
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
