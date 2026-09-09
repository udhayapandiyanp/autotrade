import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAuthenticated, isSeller, isAdmin } = useAuth();

  const getBrandTarget = () => {
    if (!isAuthenticated) return '/';
    if (isSeller) return '/seller/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/buyer/dashboard';
  };

  return (
    <footer className="footer-root">
      <div className="footer-inner">
        {/* Top Branding & Mission */}
        <div className="footer-grid">
          <div className="footer-col-brand">
            <Link to={getBrandTarget()} className="footer-brand" aria-label="MOLO Home">
              <img 
                src="/logo.png" 
                alt="MOLO - Buy. Sell. Move." 
                className="footer-brand-logo" 
              />
            </Link>
            <p className="footer-brand-desc">
              The premier marketplace for verified pre-owned vehicles. Engineered for automotive enthusiasts, discerning buyers, and reputable independent sellers.
            </p>
            <div className="footer-trust-tags">
              <div className="trust-tag">
                <ShieldCheck size={15} className="trust-icon" />
                <span>Verified Inspection Data</span>
              </div>
              <div className="trust-tag">
                <Zap size={15} className="trust-icon" />
                <span>Direct Seller Connection</span>
              </div>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div className="footer-col">
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-links">
              <li><Link to={isAuthenticated && !isSeller && !isAdmin ? "/buyer/dashboard" : "/"}>Explore Inventory</Link></li>
              <li><Link to="/favorites">My Watchlist</Link></li>
              <li><Link to="/requests/buyer">Track Inquiries</Link></li>
              <li><Link to="/notifications">Alerts & Updates</Link></li>
            </ul>
          </div>

          {/* Column 3: For Sellers */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Sellers</h4>
            <ul className="footer-links">
              <li><Link to="/seller/vehicles/new">List a Vehicle</Link></li>
              <li><Link to="/seller/dashboard">Seller Console</Link></li>
              <li><Link to="/requests/seller">Incoming Buyer Leads</Link></li>
              <li><Link to="/register">Create Seller Account</Link></li>
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Security & Terms</h4>
            <ul className="footer-links">
              <li><a href="#buyer-protection">Buyer Protection Policy</a></li>
              <li><a href="#anti-fraud">Anti-Fraud Verification</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} AutoTrade Inc. Precision Pre-Owned Vehicle Trading Platform.
          </div>
          <div className="footer-sub-note">
            <span>Direct seller transactions • Zero hidden buyer surcharges</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
