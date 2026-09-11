import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'SELLER') {
        navigate('/seller/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-stage">
      {/* Left Automotive Atmosphere Panel */}
      <div className="auth-hero-pane">
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <div className="auth-brand-logo-row">
            <Link to="/" aria-label="MOLO Home">
              <img 
                src="/logo.png" 
                alt="MOLO - Buy. Sell. Move." 
                className="auth-brand-logo" 
              />
            </Link>
          </div>

          <h2 className="auth-hero-title">
            The Performance Marketplace for Discerning Drivers.
          </h2>

          <p className="auth-hero-desc">
            Direct peer-to-peer pre-owned vehicle acquisition. Transparent specs, verified seller communications, zero dealership markups.
          </p>

          <div className="auth-hero-benefits">
            <div className="auth-benefit-item">
              <ShieldCheck size={16} className="benefit-icon" />
              <span>Verified pre-owned vehicle listings</span>
            </div>
            <div className="auth-benefit-item">
              <Zap size={16} className="benefit-icon" />
              <span>Real-time direct seller inquiry dispatch</span>
            </div>
            <div className="auth-benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Personalized saved vehicle watchlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Card Pane */}
      <div className="auth-form-pane">
        <div className="auth-card-box">
          <div className="auth-box-header">
            <h1 className="auth-box-title">Welcome Back</h1>
            <p className="auth-box-subtitle">
              Sign in to access your saved watchlist, inquiries, or seller console
            </p>
          </div>

          {error && (
            <div className="toast-banner toast-error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-root">
            <div className="form-group-unit" style={{ marginBottom: '1.25rem' }}>
              <label className="unit-label">Email Address</label>
              <div className="auth-input-container">
                <Mail size={16} className="auth-field-icon" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  className="auth-input-field"
                />
              </div>
            </div>

            <div className="form-group-unit" style={{ marginBottom: '1.75rem' }}>
              <label className="unit-label">Password</label>
              <div className="auth-input-container">
                <Lock size={16} className="auth-field-icon" />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="auth-input-field"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-auth-primary"
            >
              <LogIn size={17} />
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            </button>
          </form>

          <div className="auth-box-footer">
            <span>New to AutoTrade?</span>{' '}
            <Link to="/register" className="auth-footer-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
