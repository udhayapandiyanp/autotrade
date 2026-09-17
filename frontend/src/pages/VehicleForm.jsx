import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Car,
  Fuel,
  Settings2,
  Calendar,
  DollarSign,
  Gauge,
  FileText
} from 'lucide-react';

export default function VehicleForm() {
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
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchVehicleData = async () => {
        setFetching(true);
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
          setError(err.message || 'Failed to retrieve vehicle details.');
        } finally {
          setFetching(false);
        }
      };
      fetchVehicleData();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numPrice = parseFloat(price);
    const numMileage = parseInt(mileage, 10);
    const numYear = parseInt(year, 10);

    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please provide a valid asking price greater than zero.');
      return;
    }
    if (isNaN(numMileage) || numMileage < 0) {
      setError('Odometer mileage cannot be negative.');
      return;
    }
    const currentYear = new Date().getFullYear();
    if (isNaN(numYear) || numYear < 1900 || numYear > currentYear + 1) {
      setError(`Please specify a valid manufacturing year between 1900 and ${currentYear + 1}.`);
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
      setError(err.message || 'Failed to save vehicle specifications.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="workspace-page-root">
        <div className="workspace-container" style={{ maxWidth: '820px' }}>
          <div className="form-card-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading vehicle specifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-page-root">
      <div className="workspace-container" style={{ maxWidth: '860px' }}>
        {/* Header Strip */}
        <div className="workspace-header-bar" style={{ marginBottom: '1.75rem' }}>
          <div>
            <Link to="/seller/dashboard" className="form-back-nav">
              <ArrowLeft size={15} />
              <span>Back to Inventory</span>
            </Link>
            <h1 className="workspace-title" style={{ marginTop: '0.5rem' }}>
              {isEditMode ? 'Edit Vehicle Specifications' : 'List a Vehicle for Sale'}
            </h1>
            <p className="workspace-desc">
              Provide accurate technical parameters and pricing to attract qualified buyers
            </p>
          </div>
        </div>

        {error && (
          <div className="toast-banner toast-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Structured Form Panel */}
        <div className="form-card-panel">
          <form onSubmit={handleSubmit} className="vehicle-edit-form">
            {/* Make & Model */}
            <div className="form-two-cols">
              <div className="form-group-unit">
                <label className="unit-label">
                  <Car size={14} />
                  <span>Vehicle Make / Brand</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={make} 
                  onChange={e => setMake(e.target.value)} 
                  placeholder="e.g. Porsche, BMW, Toyota" 
                  className="unit-input"
                />
              </div>

              <div className="form-group-unit">
                <label className="unit-label">
                  <Car size={14} />
                  <span>Vehicle Model</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={model} 
                  onChange={e => setModel(e.target.value)} 
                  placeholder="e.g. 911 Carrera, M3 Competition" 
                  className="unit-input"
                />
              </div>
            </div>

            {/* Year & Price */}
            <div className="form-two-cols">
              <div className="form-group-unit">
                <label className="unit-label">
                  <Calendar size={14} />
                  <span>Manufacturing Year</span>
                </label>
                <input 
                  type="number" 
                  required 
                  value={year} 
                  onChange={e => setYear(e.target.value)} 
                  placeholder="e.g. 2022" 
                  className="unit-input"
                />
              </div>

              <div className="form-group-unit">
                <label className="unit-label">
                  <DollarSign size={14} />
                  <span>Asking Price (₹) {price ? <span className="price-preview-tag">≈ {formatPrice(price)}</span> : null}</span>
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="e.g. 2500000" 
                  className="unit-input"
                />
              </div>
            </div>

            {/* Mileage & Fuel Type */}
            <div className="form-two-cols">
              <div className="form-group-unit">
                <label className="unit-label">
                  <Gauge size={14} />
                  <span>Odometer Mileage (mi)</span>
                </label>
                <input 
                  type="number" 
                  required 
                  value={mileage} 
                  onChange={e => setMileage(e.target.value)} 
                  placeholder="e.g. 18500" 
                  className="unit-input"
                />
              </div>

              <div className="form-group-unit">
                <label className="unit-label">
                  <Fuel size={14} />
                  <span>Powertrain / Fuel Type</span>
                </label>
                <select 
                  value={fuelType} 
                  onChange={e => setFuelType(e.target.value)}
                  className="unit-select"
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Transmission */}
            <div className="form-group-unit">
              <label className="unit-label">
                <Settings2 size={14} />
                <span>Transmission</span>
              </label>
              <select 
                value={transmission} 
                onChange={e => setTransmission(e.target.value)}
                className="unit-select"
              >
                <option value="AUTOMATIC">Automatic Transmission</option>
                <option value="MANUAL">Manual Transmission</option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group-unit">
              <label className="unit-label">
                <FileText size={14} />
                <span>Vehicle Overview & Condition Notes</span>
              </label>
              <textarea 
                rows="4" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Highlight recent service history, vehicle options, tire wear, warranty status, modifications..."
                className="unit-textarea"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-submit-row">
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary-action"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Save size={16} />
                <span>{loading ? 'Saving Listing...' : isEditMode ? 'Update Vehicle' : 'Save & Continue to Inventory'}</span>
              </button>

              <Link to="/seller/dashboard" className="btn-secondary-action">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
