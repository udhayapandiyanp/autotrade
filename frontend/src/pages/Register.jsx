import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ShoppingBag, 
  Store, 
  AlertCircle, 
  CheckCircle,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('BUYER');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (role === 'ADMIN') {
      setError('Registration for administrative roles is restricted.');
      setLoading(false);
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        role
      });
      setSuccess('Account created successfully! Redirecting you to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please review your details.');
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
            Join the Premier Used Vehicle Marketplace.
          </h2>

          <p className="auth-hero-desc">
            Whether purchasing your next dream car or advertising your vehicle to qualified enthusiasts, AutoTrade provides verified transparency.
          </p>

          <div className="auth-hero-benefits">
            <div className="auth-benefit-item">
              <ShieldCheck size={16} className="benefit-icon" />
              <span>Direct peer-to-peer automotive inquiries</span>
            </div>
            <div className="auth-benefit-item">
              <Zap size={16} className="benefit-icon" />
              <span>Instant seller dashboard & photo studio</span>
            </div>
            <div className="auth-benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Zero hidden buyer surcharges or commissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <div className="auth-card-box" style={{ maxWidth: '540px' }}>
          <div className="auth-box-header">
            <h1 className="auth-box-title">Create an Account</h1>
            <p className="auth-box-subtitle">
              Select your account type and fill in your contact information
            </p>
          </div>

          {error && (
            <div className="toast-banner toast-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="toast-banner toast-success" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-root">
            {/* Role Toggle Selector */}
            <div className="form-group-unit" style={{ marginBottom: '1.25rem' }}>
              <label className="unit-label">I want to join as a:</label>
              <div className="role-selection-grid">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`role-select-box ${role === 'BUYER' ? 'active' : ''}`}
                >
                  <ShoppingBag size={20} className="role-box-icon" />
                  <span className="role-box-title">Buyer</span>
                  <span className="role-box-sub">Explore & inquire on cars</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`role-select-box ${role === 'SELLER' ? 'active' : ''}`}
                >
                  <Store size={20} className="role-box-icon" />
                  <span className="role-box-title">Seller</span>
                  <span className="role-box-sub">List & manage inventory</span>
                </button>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="form-two-cols" style={{ marginBottom: '1rem' }}>
              <div className="form-group-unit">
                <label className="unit-label">First Name</label>
                <div className="auth-input-container">
                  <User size={16} className="auth-field-icon" />
                  <input 
                    type="text" 
                    required 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    placeholder="John"
                    className="auth-input-field"
                  />
                </div>
              </div>

              <div className="form-group-unit">
                <label className="unit-label">Last Name</label>
                <div className="auth-input-container">
                  <User size={16} className="auth-field-icon" />
                  <input 
                    type="text" 
                    required 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                    placeholder="Doe"
                    className="auth-input-field"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group-unit" style={{ marginBottom: '1rem' }}>
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

            {/* Password */}
            <div className="form-group-unit" style={{ marginBottom: '1rem' }}>
              <label className="unit-label">Password (Min 6 characters)</label>
              <div className="auth-input-container">
                <Lock size={16} className="auth-field-icon" />
                <input 
                  type="password" 
                  required 
                  minLength={6} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="auth-input-field"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group-unit" style={{ marginBottom: '1.5rem' }}>
              <label className="unit-label">Phone Number (Optional)</label>
              <div className="auth-input-container">
                <Phone size={16} className="auth-field-icon" />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+91 98765 43210"
                  className="auth-input-field"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-auth-primary"
            >
              <UserPlus size={17} />
              <span>{loading ? 'Creating Account...' : 'Create AutoTrade Account'}</span>
            </button>
          </form>

          <div className="auth-box-footer">
            <span>Already have an account?</span>{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
