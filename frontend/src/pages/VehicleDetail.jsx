import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

function VehicleDetail() {
  const { id } = useParams();
  const { isAuthenticated, isSeller, isAdmin, user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('/placeholder-car.jpg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Favorites state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Inquiry form states
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || '');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Reporting states
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('FRAUD');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const vehicleData = await apiFetch(`/vehicles/${id}`);
      setVehicle(vehicleData);

      const imagesData = await apiFetch(`/vehicles/${id}/images`);
      setImages(imagesData || []);
      if (imagesData && imagesData.length > 0) {
        const primary = imagesData.find(img => img.isPrimary) || imagesData[0];
        setSelectedImage(primary.imageUrl);
      }

      // Check if favorited
      if (isAuthenticated && !isSeller && !isAdmin) {
        const favorites = await apiFetch('/favorites');
        const found = favorites.some(fav => fav.vehicleId === id);
        setIsFavorited(found);
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
    if (!isAuthenticated) return;
    setFavLoading(true);
    setFeedback('');
    try {
      if (isFavorited) {
        await apiFetch(`/favorites/${id}`, { method: 'DELETE' });
        setIsFavorited(false);
        setFeedback('Removed from watchlist.');
      } else {
        await apiFetch(`/favorites/${id}`, { method: 'POST' });
        setIsFavorited(true);
        setFeedback('Added to watchlist!');
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
      setFeedback('Your inquiry request has been sent to the seller.');
      setInquiryMsg('');
      setInquiryPhone('');
      // Trigger unread notification update
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
      setFeedback('Listing reported. Thank you for helping keep our platform safe.');
      setReportDesc('');
      setShowReportForm(false);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading vehicle specifications...</div>;
  if (error) return (
    <div className="detail-error-container">
      <div className="error-banner">{error}</div>
      <Link to="/" className="btn-back">Return to Catalog</Link>
    </div>
  );
  if (!vehicle) return <div className="empty-state">Listing not found.</div>;

  const showFavoriteButton = isAuthenticated && !isSeller && !isAdmin;
  const showInquiryForm = isAuthenticated && !isSeller && !isAdmin;

  return (
    <div className="detail-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="btn-back">← Back to Catalog</Link>
        {showFavoriteButton && (
          <button 
            disabled={favLoading} 
            onClick={handleFavoriteToggle} 
            className="btn-page"
            style={{ borderColor: isFavorited ? '#ef4444' : 'rgba(255,255,255,0.1)' }}
          >
            {isFavorited ? '❤️ Favorited' : '🖤 Add to Watchlist'}
          </button>
        )}
      </div>

      {feedback && <div className="success-banner">{feedback}</div>}
      
      <div className="detail-grid">
        <div className="gallery-section">
          <div className="main-image-container">
            <img src={selectedImage} alt={`${vehicle.make} ${vehicle.model}`} className="main-image" />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map(img => (
                <img 
                  key={img.id} 
                  src={img.imageUrl} 
                  alt="thumbnail" 
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`thumbnail ${selectedImage === img.imageUrl ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="specs-section">
          <div className="spec-header">
            <span className="spec-badge">{vehicle.status}</span>
            <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <h2 className="spec-price">{formatPrice(vehicle.price)}</h2>
          </div>

          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-label">Mileage</span>
              <span className="spec-value">{vehicle.mileage.toLocaleString()} miles</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Fuel Type</span>
              <span className="spec-value">{vehicle.fuelType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Transmission</span>
              <span className="spec-value">{vehicle.transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Seller</span>
              <span className="spec-value">{vehicle.sellerName}</span>
            </div>
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{vehicle.description || 'No description provided by the seller.'}</p>
          </div>

          {showInquiryForm && (
            <div className="contact-box">
              <h3>Inquire About This Car</h3>
              <form onSubmit={handleInquirySubmit} className="auth-form" style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label>Message</label>
                  <textarea 
                    rows="3" 
                    required 
                    value={inquiryMsg} 
                    onChange={e => setInquiryMsg(e.target.value)} 
                    placeholder="Hi, I'm interested and would like to arrange a test drive." 
                  />
                </div>
                <div className="form-row">
                  <div className="input-group flex-2">
                    <label>Preferred Contact Email</label>
                    <input type="email" required value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)} />
                  </div>
                  <div className="input-group flex-1">
                    <label>Phone (Optional)</label>
                    <input type="text" value={inquiryPhone} onChange={e => setInquiryPhone(e.target.value)} placeholder="123-456" />
                  </div>
                </div>
                <button type="submit" disabled={submittingInquiry} className="btn-save">
                  {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          )}

          {isAuthenticated && (
            <div style={{ textAlign: 'left', marginTop: '1rem' }}>
              {!showReportForm ? (
                <button onClick={() => setShowReportForm(true)} className="btn-table-action btn-archive">
                  ⚠️ Report suspicious listing
                </button>
              ) : (
                <div className="contact-box" style={{ borderColor: '#ef4444' }}>
                  <h3>Report Vehicle Listing</h3>
                  <form onSubmit={handleReportSubmit} className="auth-form" style={{ marginTop: '1rem' }}>
                    <div className="input-group">
                      <label>Reason</label>
                      <select value={reportReason} onChange={e => setReportReason(e.target.value)}>
                        <option value="FRAUD">Fraudulent Listing</option>
                        <option value="SPAM">Spam</option>
                        <option value="INACCURATE">Inaccurate Specs</option>
                        <option value="SOLD">Already Sold</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Details</label>
                      <textarea 
                        rows="2" 
                        value={reportDesc} 
                        onChange={e => setReportDesc(e.target.value)} 
                        placeholder="Provide details about the report reason..." 
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit" disabled={submittingReport} className="btn-save" style={{ background: '#ef4444' }}>
                        {submittingReport ? 'Reporting...' : 'Submit Report'}
                      </button>
                      <button type="button" onClick={() => setShowReportForm(false)} className="btn-clear">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;
