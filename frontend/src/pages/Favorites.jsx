import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

function Favorites() {
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
      setError(err.message || 'Failed to retrieve favorites watchlist.');
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
      setFeedback('Removed from watchlist.');
      fetchFavorites();
    } catch (err) {
      setError(err.message || 'Failed to remove favorite.');
    }
  };

  return (
    <div className="favorites-container">
      <h1>My Watchlist</h1>
      <p>Track listings you are interested in</p>
      
      {feedback && <div className="success-banner">{feedback}</div>}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading watchlist...</div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <h3>Your watchlist is empty.</h3>
          <p>Browse the catalog and add vehicles to your favorites!</p>
          <Link to="/" className="btn-back">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="vehicle-grid">
          {favorites.map(fav => (
            <div key={fav.id} className="vehicle-card">
              <div className="card-content">
                <h3>{fav.make} {fav.model}</h3>
                <span className="card-price">${fav.price.toLocaleString()}</span>
                <p className="card-meta">{fav.year} • {fav.mileage.toLocaleString()} mi</p>
                <div className="table-actions" style={{ marginTop: '1rem' }}>
                  <Link to={`/vehicles/${fav.vehicleId}`} className="btn-view-details" style={{ flex: 2 }}>
                    View Specs
                  </Link>
                  <button onClick={() => handleRemove(fav.vehicleId)} className="btn-table-action btn-archive" style={{ flex: 1 }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
