import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import { 
  Gauge, 
  Fuel, 
  Settings2, 
  User, 
  Heart, 
  ArrowUpRight 
} from 'lucide-react';

const FALLBACK_CAR_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

export default function VehicleCard({ vehicle, onFavoriteChanged, isSavedInitial = false }) {
  const { isAuthenticated, isSeller, isAdmin } = useAuth();
  const [imageUrl, setImageUrl] = useState(FALLBACK_CAR_IMG);
  const [isFavorited, setIsFavorited] = useState(isSavedInitial);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    setIsFavorited(isSavedInitial);
  }, [isSavedInitial]);

  useEffect(() => {
    let isMounted = true;
    const fetchImages = async () => {
      try {
        const images = await apiFetch(`/vehicles/${vehicle.id}/images`);
        if (isMounted && images && images.length > 0) {
          const primaryImg = images.find(img => img.isPrimary) || images[0];
          if (primaryImg.imageUrl) {
            setImageUrl(primaryImg.imageUrl);
          }
        }
      } catch (err) {
        // Fallback remains
      }
    };
    fetchImages();
    return () => { isMounted = false; };
  }, [vehicle.id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || isSeller || isAdmin || favLoading) return;

    setFavLoading(true);
    try {
      if (isFavorited) {
        await apiFetch(`/favorites/${vehicle.id}`, { method: 'DELETE' });
        setIsFavorited(false);
        if (onFavoriteChanged) onFavoriteChanged(vehicle.id, false);
      } else {
        await apiFetch(`/favorites/${vehicle.id}`, { method: 'POST' });
        setIsFavorited(true);
        if (onFavoriteChanged) onFavoriteChanged(vehicle.id, true);
      }
    } catch (err) {
      // Ignore
    } finally {
      setFavLoading(false);
    }
  };

  const handleImageError = () => {
    setImageUrl(FALLBACK_CAR_IMG);
  };

  const showFavoriteAction = isAuthenticated && !isSeller && !isAdmin;

  return (
    <article className="vehicle-card-root">
      <Link to={`/vehicles/${vehicle.id}`} className="vehicle-card-link-wrapper" aria-label={`View details for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
        {/* Media Frame */}
        <div className="card-media-stage">
          <img 
            src={imageUrl} 
            alt={`${vehicle.make} ${vehicle.model}`} 
            className="card-media-img"
            onError={handleImageError}
            loading="lazy"
          />
          <div className="card-media-gradient" />

          {/* Status Badge */}
          {vehicle.status && vehicle.status !== 'PUBLISHED' && (
            <span className={`card-status-badge badge-${vehicle.status.toLowerCase()}`}>
              {vehicle.status}
            </span>
          )}

          {/* Quick Year Pill */}
          <span className="card-year-pill">{vehicle.year}</span>

          {/* Watchlist Button */}
          {showFavoriteAction && (
            <button 
              type="button"
              onClick={handleToggleFavorite} 
              className={`card-heart-btn ${isFavorited ? 'is-favorited' : ''}`}
              title={isFavorited ? 'Remove from Saved' : 'Save to Watchlist'}
              disabled={favLoading}
              aria-label={isFavorited ? 'Remove from Saved' : 'Save to Watchlist'}
            >
              <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Card Content Area */}
        <div className="card-info-area">
          {/* Title & Price Header */}
          <div className="card-header-row">
            <h3 className="card-title-text" title={`${vehicle.make} ${vehicle.model}`}>
              <span className="card-brand">{vehicle.make}</span> {vehicle.model}
            </h3>
            <div className="card-price-value">{formatPrice(vehicle.price)}</div>
          </div>

          {/* Precision Spec Grid */}
          <div className="card-specs-row">
            <div className="card-spec-item" title="Odometer Mileage">
              <Gauge size={13} className="card-spec-icon" />
              <span>{vehicle.mileage ? Number(vehicle.mileage).toLocaleString() : '0'} mi</span>
            </div>
            <div className="card-spec-item" title="Fuel Type">
              <Fuel size={13} className="card-spec-icon" />
              <span>{vehicle.fuelType || 'Petrol'}</span>
            </div>
            <div className="card-spec-item" title="Transmission">
              <Settings2 size={13} className="card-spec-icon" />
              <span>{vehicle.transmission || 'Automatic'}</span>
            </div>
          </div>

          {/* Card Footer: Seller & Action */}
          <div className="card-footer-row">
            <div className="card-seller-pill" title={`Seller: ${vehicle.sellerName || 'Verified'}`}>
              <User size={13} />
              <span className="card-seller-name">{vehicle.sellerName || 'Private Seller'}</span>
            </div>

            <span className="card-action-cue">
              <span>Inspect</span>
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
