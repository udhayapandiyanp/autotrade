import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

function VehicleCard({ vehicle }) {
  const [imageUrl, setImageUrl] = useState('/placeholder-car.jpg');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await apiFetch(`/vehicles/${vehicle.id}/images`);
        if (images && images.length > 0) {
          const primaryImg = images.find(img => img.isPrimary) || images[0];
          setImageUrl(primaryImg.imageUrl);
        }
      } catch (err) {
        // Fallback to placeholder
      }
    };
    fetchImages();
  }, [vehicle.id]);

  return (
    <div className="vehicle-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="card-image" />
        <span className="card-status-badge">{vehicle.status}</span>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{vehicle.make} {vehicle.model}</h3>
          <span className="card-price">${vehicle.price.toLocaleString()}</span>
        </div>
        <p className="card-meta">
          <span>{vehicle.year}</span> • <span>{vehicle.transmission}</span> • <span>{vehicle.fuelType}</span>
        </p>
        <div className="card-specs">
          <span>Odometer: {vehicle.mileage.toLocaleString()} mi</span>
          <span>Seller: {vehicle.sellerName}</span>
        </div>
        <Link to={`/vehicles/${vehicle.id}`} className="btn-view-details">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;
