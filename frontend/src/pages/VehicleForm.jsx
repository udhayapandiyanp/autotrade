import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';

function VehicleForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('PETROL');
  const [transmission, setTransmission] = useState('AUTOMATIC');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchVehicleData = async () => {
        setLoading(true);
        try {
          const v = await apiFetch(`/vehicles/${id}`);
          setMake(v.make);
          setModel(v.model);
          setYear(v.year.toString());
          setPrice(v.price.toString());
          setMileage(v.mileage.toString());
          setFuelType(v.fuelType);
          setTransmission(v.transmission);
          setDescription(v.description || '');
        } catch (err) {
          setError(err.message || 'Failed to retrieve listing details.');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicleData();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validations
    const numPrice = parseFloat(price);
    const numMileage = parseInt(mileage, 10);
    const numYear = parseInt(year, 10);

    if (isNaN(numPrice) || numPrice < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (isNaN(numMileage) || numMileage < 0) {
      setError('Mileage cannot be negative.');
      return;
    }
    if (isNaN(numYear) || numYear < 1886 || numYear > new Date().getFullYear() + 1) {
      setError('Please provide a valid manufacturing year.');
      return;
    }

    setLoading(true);
    const payload = {
      make,
      model,
      year: numYear,
      price: numPrice,
      mileage: numMileage,
      fuelType,
      transmission,
      description
    };

    try {
      if (isEditMode) {
        await apiFetch(`/vehicles/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/vehicles', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        <h2>{isEditMode ? 'Edit Vehicle Specifications' : 'List a New Vehicle'}</h2>
        <p className="form-subtitle">Fill in specifications to advertise your car</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="spec-form">
          <div className="form-row">
            <div className="input-group">
              <label>Make</label>
              <input type="text" required value={make} onChange={e => setMake(e.target.value)} placeholder="e.g. Toyota" />
            </div>
            <div className="input-group">
              <label>Model</label>
              <input type="text" required value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Camry" />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Manufacturing Year</label>
              <input type="number" required value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2020" />
            </div>
            <div className="input-group">
              <label>Asking Price ($)</label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 19500" />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Odometer Mileage (mi)</label>
              <input type="number" required value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 45000" />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Fuel Type</label>
              <select value={fuelType} onChange={e => setFuelType(e.target.value)}>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="input-group">
              <label>Transmission</label>
              <select value={transmission} onChange={e => setTransmission(e.target.value)}>
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Detailed Description</label>
            <textarea 
              rows="4" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detail modifications, condition, service history..."
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="btn-save">
              {loading ? 'Saving...' : 'Save Listing'}
            </button>
            <Link to="/seller/dashboard" className="btn-cancel">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
