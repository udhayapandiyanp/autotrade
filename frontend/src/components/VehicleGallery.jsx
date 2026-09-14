import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const FALLBACK_CAR_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85';

export default function VehicleGallery({ images = [], vehicleTitle = 'Vehicle Showcase' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Normalize images
  const imageList = images.length > 0 ? images.map(img => img.imageUrl || img) : [FALLBACK_CAR_IMG];
  const activeImage = imageList[currentIndex] || FALLBACK_CAR_IMG;

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, imageList.length]);

  return (
    <div className="showroom-gallery-root">
      {/* Main Showcase Stage */}
      <div className="gallery-main-stage" onClick={() => setIsFullscreen(true)}>
        <img 
          src={activeImage} 
          alt={`${vehicleTitle} - View ${currentIndex + 1}`}
          className="gallery-active-img"
          onError={(e) => { e.currentTarget.src = FALLBACK_CAR_IMG; }}
        />
        <div className="gallery-vignette-overlay" />

        {/* Counter Badge */}
        <div className="gallery-counter-pill">
          <ImageIcon size={13} />
          <span>{currentIndex + 1} / {imageList.length}</span>
        </div>

        {/* Expand Trigger */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          className="gallery-expand-btn"
          title="Open Fullscreen Gallery"
          aria-label="Open Fullscreen Gallery"
        >
          <Maximize2 size={16} />
        </button>

        {/* Arrows on Stage if multiple */}
        {imageList.length > 1 && (
          <>
            <button 
              type="button" 
              onClick={handlePrev} 
              className="gallery-nav-arrow arrow-left" 
              aria-label="Previous Photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              type="button" 
              onClick={handleNext} 
              className="gallery-nav-arrow arrow-right" 
              aria-label="Next Photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Ribbon */}
      {imageList.length > 1 && (
        <div className="gallery-thumbnail-ribbon">
          {imageList.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`gallery-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
            >
              <img 
                src={url} 
                alt={`Thumbnail ${idx + 1}`} 
                onError={(e) => { e.currentTarget.src = FALLBACK_CAR_IMG; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {isFullscreen && (
        <div className="gallery-lightbox-backdrop" onClick={() => setIsFullscreen(false)}>
          <div className="gallery-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close-btn" 
              onClick={() => setIsFullscreen(false)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <img 
              src={activeImage} 
              alt={vehicleTitle}
              className="lightbox-main-img"
              onError={(e) => { e.currentTarget.src = FALLBACK_CAR_IMG; }}
            />

            {imageList.length > 1 && (
              <>
                <button 
                  type="button" 
                  onClick={handlePrev} 
                  className="lightbox-nav-arrow arrow-left" 
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="lightbox-nav-arrow arrow-right" 
                  aria-label="Next Photo"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div className="lightbox-footer">
              <span className="lightbox-title">{vehicleTitle}</span>
              <span className="lightbox-counter">{currentIndex + 1} of {imageList.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
