import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

function ImageManager() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/vehicles/${id}/images`);
      setImages(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve image list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  const handleAddImage = async (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');
    
    if (!newUrl.trim()) {
      setError('Please provide a valid image URL.');
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`/vehicles/${id}/images`, {
        method: 'POST',
        body: JSON.stringify({
          imageUrl: newUrl,
          isPrimary
        })
      });
      setFeedback('Image URL added successfully!');
      setNewUrl('');
      setIsPrimary(false);
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to register image reference.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image reference?')) {
      return;
    }
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/vehicles/${id}/images/${imageId}`, {
        method: 'DELETE'
      });
      setFeedback('Image reference deleted.');
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to remove image reference.');
    }
  };

  return (
    <div className="image-manager-container">
      <div className="manager-card">
        <div className="manager-header">
          <h2>Manage Vehicle Images</h2>
          <Link to="/seller/dashboard" className="btn-back">← Back to Dashboard</Link>
        </div>

        {error && <div className="error-banner">{error}</div>}
        {feedback && <div className="success-banner">{feedback}</div>}

        <form onSubmit={handleAddImage} className="add-image-form">
          <h3>Add Image Reference</h3>
          <div className="form-row align-end">
            <div className="input-group flex-2">
              <label>Image URL</label>
              <input 
                type="url" 
                required 
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)} 
                placeholder="https://example.com/your-car-image.jpg" 
              />
            </div>
            <div className="input-group checkbox-group flex-1">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isPrimary} 
                  onChange={e => setIsPrimary(e.target.checked)} 
                />
                Primary Image
              </label>
            </div>
            <button type="submit" disabled={saving} className="btn-add-img">
              {saving ? 'Adding...' : 'Add URL'}
            </button>
          </div>
        </form>

        <div className="image-gallery-section">
          <h3>Existing Images</h3>
          {loading ? (
            <div className="loading-spinner">Loading image references...</div>
          ) : images.length === 0 ? (
            <div className="empty-state">No image references registered for this vehicle.</div>
          ) : (
            <div className="manager-image-grid">
              {images.map(img => (
                <div key={img.id} className="manager-img-card">
                  <img src={img.imageUrl} alt="Vehicle spec" className="manager-preview-img" />
                  <div className="manager-img-footer">
                    <span className={`pill-badge ${img.isPrimary ? 'primary-badge' : 'secondary-badge'}`}>
                      {img.isPrimary ? 'Primary' : 'Additional'}
                    </span>
                    <button onClick={() => handleDeleteImage(img.id)} className="btn-delete-img">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageManager;
