import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import VehicleGallery from '../components/VehicleGallery';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  Send, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MessageSquare,
  User,
  ShieldCheck,
  Share2
} from 'lucide-react';

export default function VehicleDetail() {
  const { id } = useParams();
  const { isAuthenticated, isSeller, isAdmin, user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Favorites state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Inquiry form states
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Reporting states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('FRAUD');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Set default inquiry email when user is available
  useEffect(() => {
    if (user && user.email && !inquiryEmail) {
      setInquiryEmail(user.email);
    }
  }, [user]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const vehicleData = await apiFetch(`/vehicles/${id}`);
      setVehicle(vehicleData);

      const imagesData = await apiFetch(`/vehicles/${id}/images`);
      setImages(imagesData || []);

      // Check if favorited
      if (isAuthenticated && !isSeller && !isAdmin) {
        try {
          const favorites = await apiFetch('/favorites');
          const found = favorites.some(fav => fav.vehicleId === id);
          setIsFavorited(found);
        } catch (favErr) {
          // Non-blocking
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || favLoading || isSeller || isAdmin) return;
    setFavLoading(true);
    setFeedback('');
    try {
      if (isFavorited) {
        await apiFetch(`/favorites/${id}`, { method: 'DELETE' });
        setIsFavorited(false);
        setFeedback('Listing removed from your saved watchlist.');
      } else {
        await apiFetch(`/favorites/${id}`, { method: 'POST' });
        setIsFavorited(true);
        setFeedback('Listing saved to your watchlist!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update watchlist.');
    } finally {
      setFavLoading(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');
    setSubmittingInquiry(true);
    try {
      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: id,
          message: inquiryMsg,
          contactEmail: inquiryEmail,
          contactPhone: inquiryPhone
        })
      });
      setFeedback('Your inquiry was sent directly to the seller. Track responses in My Inquiries.');
      setInquiryMsg('');
      window.dispatchEvent(new Event('notification-update'));
    } catch (err) {
      setError(err.message || 'Failed to send inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');
    setSubmittingReport(true);
    try {
      await apiFetch(`/reports/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          reason: reportReason,
          description: reportDesc
        })
      });
      setFeedback('Listing report submitted for admin moderation. Thank you for protecting our community.');
      setReportDesc('');
      setShowReportModal(false);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setFeedback('Listing link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="showroom-container">
        <LoadingSkeleton type="showroom" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="showroom-container">
        <div className="detail-error-state">
          <AlertCircle size={36} className="error-icon" />
          <h2>Listing Unavailable</h2>
          <p>{error || 'The vehicle you requested could not be located in our active database.'}</p>
          <Link to="/buyer/dashboard" className="btn-primary-action">
            <ArrowLeft size={16} />
            <span>Return to Marketplace Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const showFavoriteButton = isAuthenticated && !isSeller && !isAdmin;
  const showInquiryForm = isAuthenticated && !isSeller && !isAdmin;

  return (
    <div className="showroom-page-root">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="showroom-top-bar">
        <div className="showroom-top-inner">
          <Link to="/buyer/dashboard" className="showroom-back-link">
            <ArrowLeft size={16} />
            <span>Back to Inventory</span>
          </Link>

          <div className="showroom-top-actions">
            <button 
              type="button" 
              onClick={handleShare} 
              className="btn-action-pill"
              title="Copy listing URL"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            {showFavoriteButton && (
              <button 
                type="button"
                disabled={favLoading} 
                onClick={handleFavoriteToggle} 
                className={`btn-action-pill ${isFavorited ? 'is-active-saved' : ''}`}
              >
                <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} />
                <span>{isFavorited ? 'In Watchlist' : 'Save Vehicle'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedback && (
        <div className="showroom-feedback-banner">
          <CheckCircle size={18} className="feedback-icon" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Showroom Hero Layout */}
      <div className="showroom-content-stage">
        <div className="showroom-main-grid">
          {/* Left: Expansive Digital Showroom Gallery */}
          <div className="showroom-gallery-column">
            <VehicleGallery 
              images={images} 
              vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              status={vehicle.status}
            />

            {/* Vehicle Overview / Description Box */}
            <div className="showroom-overview-card">
              <div className="overview-header">
                <FileText size={18} className="overview-icon" />
                <h3 className="overview-title">Vehicle Overview & Seller Notes</h3>
              </div>
              <p className="overview-body-text">
                {vehicle.description || 'The seller has not provided extensive description notes for this listing. Contact the seller directly using the inquiry panel to verify vehicle history, recent maintenance, service logs, or schedule a physical inspection.'}
              </p>
            </div>

            {/* Platform Protection & Trust Indicators */}
            <div className="showroom-protection-card">
              <div className="protection-badge-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="protection-content">
                <h4 className="protection-title">AutoTrade Buyer Confidence</h4>
                <p className="protection-desc">
                  Direct communication with vehicle owners. No hidden broker fees. If this vehicle appears misleading, reported listings are moderated promptly.
                </p>
              </div>
              {isAuthenticated && (
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(true)} 
                  className="btn-flag-listing"
                  title="Report inaccurate or fraudulent listing"
                >
                  <ShieldAlert size={14} />
                  <span>Report Listing</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Identity, Specs Matrix & Direct Inquiry Panel */}
          <aside className="showroom-specs-column">
            {/* Identity & Pricing Header Card */}
            <div className="identity-hero-card">
              <div className="identity-tags-row">
                <StatusBadge status={vehicle.status || 'PUBLISHED'} />
                <span className="identity-year-pill">{vehicle.year}</span>
              </div>

              <h1 className="identity-vehicle-title">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              <div className="identity-price-row">
                <div className="identity-price-number">{formatPrice(vehicle.price)}</div>
                <span className="identity-price-sub">Asking Price (INR)</span>
              </div>
            </div>

            {/* Key Technical Matrix */}
            <div className="specs-matrix-grid">
              <div className="spec-matrix-tile">
                <div className="spec-tile-icon-box">
                  <Calendar size={18} />
                </div>
                <div className="spec-tile-data">
                  <span className="spec-tile-label">Manufacturing Year</span>
                  <span className="spec-tile-value">{vehicle.year}</span>
                </div>
              </div>

              <div className="spec-matrix-tile">
                <div className="spec-tile-icon-box">
                  <Gauge size={18} />
                </div>
                <div className="spec-tile-data">
                  <span className="spec-tile-label">Odometer Reading</span>
                  <span className="spec-tile-value">
                    {vehicle.mileage ? Number(vehicle.mileage).toLocaleString() : '0'} mi
                  </span>
                </div>
              </div>

              <div className="spec-matrix-tile">
                <div className="spec-tile-icon-box">
                  <Fuel size={18} />
                </div>
                <div className="spec-tile-data">
                  <span className="spec-tile-label">Powertrain / Fuel</span>
                  <span className="spec-tile-value">{vehicle.fuelType || 'Petrol'}</span>
                </div>
              </div>

              <div className="spec-matrix-tile">
                <div className="spec-tile-icon-box">
                  <Settings2 size={18} />
                </div>
                <div className="spec-tile-data">
                  <span className="spec-tile-label">Transmission</span>
                  <span className="spec-tile-value">{vehicle.transmission || 'Automatic'}</span>
                </div>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="seller-profile-card">
              <div className="seller-avatar-icon">
                <User size={20} />
              </div>
              <div className="seller-meta">
                <span className="seller-label">Vehicle Listed By</span>
                <span className="seller-name">{vehicle.sellerName || 'Private Seller'}</span>
                <span className="seller-badge">Direct Marketplace Seller</span>
              </div>
            </div>

            {/* Sticky Direct Seller Inquiry Box */}
            <div className="inquiry-action-card">
              <div className="inquiry-card-header">
                <MessageSquare size={18} className="inquiry-icon" />
                <h3 className="inquiry-card-title">Send Direct Inquiry</h3>
              </div>

              {showInquiryForm ? (
                <form onSubmit={handleInquirySubmit} className="inquiry-form-inner">
                  <p className="inquiry-helper-text">
                    Send a direct message to <strong>{vehicle.sellerName || 'the seller'}</strong> regarding availability, inspection, or pricing.
                  </p>

                  <div className="form-group-unit">
                    <label className="unit-label">Inquiry Message</label>
                    <textarea 
                      rows="3" 
                      required 
                      value={inquiryMsg} 
                      onChange={e => setInquiryMsg(e.target.value)} 
                      placeholder="Hi, I am interested in this vehicle and would like to schedule an inspection or test drive."
                      className="unit-textarea"
                    />
                  </div>

                  <div className="form-group-unit">
                    <label className="unit-label">Your Contact Email</label>
                    <input 
                      type="email" 
                      required 
                      value={inquiryEmail} 
                      onChange={e => setInquiryEmail(e.target.value)} 
                      className="unit-input"
                    />
                  </div>

                  <div className="form-group-unit">
                    <label className="unit-label">Phone Number (Optional)</label>
                    <input 
                      type="text" 
                      value={inquiryPhone} 
                      onChange={e => setInquiryPhone(e.target.value)} 
                      placeholder="+91 98765 43210" 
                      className="unit-input"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingInquiry} 
                    className="btn-send-inquiry"
                  >
                    <Send size={16} />
                    <span>{submittingInquiry ? 'Dispatching Message...' : 'Submit Inquiry to Seller'}</span>
                  </button>
                </form>
              ) : !isAuthenticated ? (
                <div className="inquiry-login-prompt">
                  <p>Sign in to contact the seller directly and track inquiry replies.</p>
                  <Link to="/login" className="btn-primary-action" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign In to Inquire
                  </Link>
                </div>
              ) : (
                <div className="inquiry-seller-prompt">
                  <p>You are viewing this listing in a seller or administrator session.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Moderation Report Modal */}
      {showReportModal && (
        <div className="modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="modal-dialog-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <ShieldAlert size={20} className="modal-icon-rose" />
                <h3 className="modal-title">Report Vehicle Listing</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowReportModal(false)}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="modal-form">
              <p className="modal-desc">
                Help maintain marketplace integrity. Submitted reports are prioritized in the administrative moderation queue.
              </p>

              <div className="form-group-unit">
                <label className="unit-label">Reason for Flagging</label>
                <select 
                  value={reportReason} 
                  onChange={e => setReportReason(e.target.value)}
                  className="unit-select"
                >
                  <option value="FRAUD">Suspected Fraud or Scam</option>
                  <option value="SPAM">Spam or Duplicate Post</option>
                  <option value="INACCURATE">Inaccurate Photos / Mileage / Pricing</option>
                  <option value="SOLD">Vehicle Already Sold</option>
                </select>
              </div>

              <div className="form-group-unit">
                <label className="unit-label">Explanation & Details</label>
                <textarea 
                  rows="3" 
                  value={reportDesc} 
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="Describe what was misleading or suspicious..."
                  className="unit-textarea"
                />
              </div>

              <div className="modal-footer-actions">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  className="btn-secondary-action"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReport}
                  className="btn-danger-action"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
