import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import VehicleCard from '../components/VehicleCard';

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter States
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minMileage, setMinMileage] = useState('');
  const [maxMileage, setMaxMileage] = useState('');

  // Pagination & Sorting States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchCatalog = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query string
      const params = new URLSearchParams();
      if (make) params.append('make', make);
      if (model) params.append('model', model);
      if (fuelType) params.append('fuelType', fuelType);
      if (transmission) params.append('transmission', transmission);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (minYear) params.append('minYear', minYear);
      if (maxYear) params.append('maxYear', maxYear);
      if (minMileage) params.append('minMileage', minMileage);
      if (maxMileage) params.append('maxMileage', maxMileage);
      params.append('page', page);
      params.append('size', 6); // 6 listings per page
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const data = await apiFetch(`/vehicles?${params.toString()}`);
      setVehicles(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message || 'Failed to retrieve marketplace catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [page, sortBy, sortDir]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0); // Reset page to first page
    fetchCatalog();
  };

  const handleClearFilters = () => {
    setMake('');
    setModel('');
    setFuelType('');
    setTransmission('');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setMinMileage('');
    setMaxMileage('');
    setPage(0);
    // Trigger catalog fetch implicitly
    setTimeout(fetchCatalog, 0);
  };

  return (
    <div className="home-container">
      <div className="search-section">
        <h1>Find Your Next Vehicle</h1>
        <form onSubmit={handleFilterSubmit} className="filter-form">
          <div className="filter-grid">
            <div className="input-group">
              <label>Make</label>
              <input type="text" value={make} onChange={e => setMake(e.target.value)} placeholder="e.g. Toyota" />
            </div>
            <div className="input-group">
              <label>Model</label>
              <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Camry" />
            </div>
            <div className="input-group">
              <label>Fuel Type</label>
              <select value={fuelType} onChange={e => setFuelType(e.target.value)}>
                <option value="">All</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="input-group">
              <label>Transmission</label>
              <select value={transmission} onChange={e => setTransmission(e.target.value)}>
                <option value="">All</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>
            <div className="input-group">
              <label>Price Range (₹)</label>
              <div className="range-inputs">
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" />
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" />
              </div>
            </div>
            <div className="input-group">
              <label>Year Range</label>
              <div className="range-inputs">
                <input type="number" value={minYear} onChange={e => setMinYear(e.target.value)} placeholder="Min" />
                <input type="number" value={maxYear} onChange={e => setMaxYear(e.target.value)} placeholder="Max" />
              </div>
            </div>
            <div className="input-group">
              <label>Mileage Range (mi)</label>
              <div className="range-inputs">
                <input type="number" value={minMileage} onChange={e => setMinMileage(e.target.value)} placeholder="Min" />
                <input type="number" value={maxMileage} onChange={e => setMaxMileage(e.target.value)} placeholder="Max" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-search">Apply Filters</button>
            <button type="button" onClick={handleClearFilters} className="btn-clear">Clear All</button>
          </div>
        </form>
      </div>

      <div className="catalog-controls">
        <div className="sort-controls">
          <label>Sort By:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="createdAt">Newest Listed</option>
            <option value="price">Price</option>
            <option value="year">Year</option>
            <option value="mileage">Mileage</option>
          </select>
          <select value={sortDir} onChange={e => setSortDir(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading marketplace listings...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">No published vehicles match your search criteria.</div>
      ) : (
        <>
          <div className="vehicle-grid">
            {vehicles.map(v => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(prev => prev - 1)} className="btn-page">
              Previous
            </button>
            <span className="page-indicator">Page {page + 1} of {totalPages || 1}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(prev => prev + 1)} className="btn-page">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
