import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import EmptyState from '../components/EmptyState';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Star, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function ImageManager() {
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
      setError(err.message || 'Failed to retrieve vehicle photos.');
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
          imageUrl: newUrl.trim(),
          isPrimary
        })
      });
      setFeedback('Photo added to vehicle gallery successfully!');
      setNewUrl('');
      setIsPrimary(false);
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to register photo URL.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to remove this photo from the vehicle listing?')) {
      return;
    }
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/vehicles/${id}/images/${imageId}`, {
        method: 'DELETE'
      });
      setFeedback('Photo removed from vehicle gallery.');
      fetchImages();
    } catch (err) {
      setError(err.message || 'Failed to remove photo.');
    }
  };

  return (
    <div className="workspace-page-root">
      <div className="workspace-container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div className="workspace-header-bar" style={{ marginBottom: '1.75rem' }}>
          <div>
            <Link to="/seller/dashboard" className="form-back-nav">
              <ArrowLeft size={15} />
              <span>Back to Inventory</span>
            </Link>
            <h1 className="workspace-title" style={{ marginTop: '0.5rem' }}>
              Vehicle Photo Studio
            </h1>
            <p className="workspace-desc">
              Curate high-resolution imagery for this vehicle to maximize buyer engagement
            </p>
          </div>
        </div>

        {error && (
          <div className="toast-banner toast-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {feedback && (
          <div className="toast-banner toast-success">
            <CheckCircle size={18} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Add Image Card Panel */}
        <div className="form-card-panel" style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} className="text-brand" />
            <span>Add New Photograph to Gallery</span>
          </h3>

          <form onSubmit={handleAddImage} className="add-photo-form">
            <div className="form-group-unit" style={{ marginBottom: '1.25rem' }}>
              <label className="unit-label">Direct Image URL (JPG / PNG / WebP)</label>
              <input 
                type="url" 
                required 
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)} 
                placeholder="https://images.unsplash.com/photo-..." 
                className="unit-input"
              />
            </div>

            <div className="photo-form-controls-row">
              <label className="photo-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isPrimary} 
                  onChange={e => setIsPrimary(e.target.checked)} 
                  className="unit-checkbox"
                />
                <span>Set as primary / cover photograph for marketplace search</span>
              </label>

              <button 
                type="submit" 
                disabled={saving} 
                className="btn-primary-action"
              >
                <Plus size={16} />
                <span>{saving ? 'Registering Photo...' : 'Add Photo to Listing'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-curation-section">
          <div className="curation-header-row">
            <h2 className="curation-title">
              <ImageIcon size={18} />
              <span>Current Gallery Photos ({images.length})</span>
            </h2>
            <span className="curation-sub">High-resolution view</span>
          </div>

          {loading ? (
            <div className="skeleton-cards-grid">
              {[1, 2, 3].map(n => (
                <div key={n} className="skeleton-shimmer skeleton-media" style={{ height: '220px', borderRadius: '12px' }} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <EmptyState 
              icon={ImageIcon}
              title="No Gallery Photos Added"
              description="Vehicles with multiple clear photos receive 5x more buyer inquiries. Add image URLs above to create your digital showroom."
            />
          ) : (
            <div className="photo-curation-grid">
              {images.map(img => (
                <div key={img.id} className="photo-curation-card">
                  <div className="photo-frame">
                    <img 
                      src={img.imageUrl} 
                      alt="Vehicle showcase" 
                      loading="lazy"
                    />
                    {img.isPrimary && (
                      <span className="photo-primary-badge">
                        <Star size={12} fill="currentColor" />
                        <span>Primary Cover</span>
                      </span>
                    )}
                  </div>

                  <div className="photo-footer-actions">
                    <span className="photo-status-tag">
                      {img.isPrimary ? 'Cover Shot' : 'Additional View'}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteImage(img.id)} 
                      className="btn-photo-delete"
                      title="Delete this photo"
                      aria-label="Delete photo"
                    >
                      <Trash2 size={15} />
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
