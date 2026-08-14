import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
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
    
    // Explicit server role boundary checker on client
    if (role === 'ADMIN') {
      setError('Registration as ADMIN is not permitted.');
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
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Select role and fill your profile details</p>
        
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Password (Min 6 chars)</label>
            <input type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="input-group">
            <label>Phone Number (Optional)</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+123456789" />
          </div>
          <div className="input-group">
            <label>Account Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="BUYER">Buyer (I want to browse & search cars)</option>
              <option value="SELLER">Seller (I want to list cars for sale)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-auth">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
