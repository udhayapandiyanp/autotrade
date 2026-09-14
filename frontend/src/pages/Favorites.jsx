import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { formatPrice } from '../utils/formatters';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  Car, 
  Calendar, 
  Gauge, 
  CheckCircle, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/favorites');
      setFavorites(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve saved watchlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (vehicleId) => {
    setFeedback('');
    try {
      await apiFetch(`/favorites/${vehicleId}`, { method: 'DELETE' });
      setFeedback('Vehicle removed from your saved watchlist.');
      fetchFavorites();
    } catch (err) {
      setError(err.message || 'Failed to remove favorite.');
    }
  };

  return (
    <div className="workspace-page-root">
      <div className="workspace-container">
        {/* Header Strip */}
        <div className="workspace-header-bar">
          <div>
            <div className="workspace-eyebrow">Buyer Workspace</div>
            <h1 className="workspace-title">Saved Watchlist</h1>
            <p className="workspace-desc">
              Track vehicle availability, compare specifications, and send direct seller inquiries
            </p>
          </div>
          <Link to="/buyer/dashboard" className="btn-secondary-action">
            <Car size={16} />
            <span>Browse More Cars</span>
          </Link>
        </div>

        {/* Feedback Alert */}
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

        {/* Content */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : favorites.length === 0 ? (
          <EmptyState 
            icon={Heart}
            title="Your Watchlist is Empty"
            description="You have not saved any vehicle listings yet. Click the heart icon on any vehicle card to monitor it here."
            action={
              <Link to="/buyer/dashboard" className="btn-primary-action">
                <span>Explore Marketplace</span>
                <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="favorites-cards-grid">
            {favorites.map(fav => (
              <div key={fav.id} className="favorite-item-card">
                <div className="favorite-card-body">
                  <div className="favorite-top-row">
                    <div>
                      <span className="favorite-year-tag">{fav.year}</span>
                      <h3 className="favorite-title">
                        {fav.make} {fav.model}
                      </h3>
                    </div>
                    <div className="favorite-price-text">
                      {formatPrice(fav.price)}
                    </div>
                  </div>

                  <div className="favorite-specs-row">
                    <div className="favorite-spec">
                      <Calendar size={13} />
                      <span>{fav.year}</span>
                    </div>
                    <div className="favorite-spec">
                      <Gauge size={13} />
                      <span>{fav.mileage ? Number(fav.mileage).toLocaleString() : '0'} mi</span>
                    </div>
                  </div>

                  <div className="favorite-actions-row">
                    <Link to={`/vehicles/${fav.vehicleId}`} className="btn-primary-action" style={{ flex: 2, justifyContent: 'center' }}>
                      <span>View Showroom</span>
                      <ExternalLink size={14} />
                    </Link>

                    <button 
                      type="button"
                      onClick={() => handleRemove(fav.vehicleId)} 
                      className="btn-danger-outline"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
