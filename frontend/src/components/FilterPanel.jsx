import React from 'react';
import { 
  RotateCcw, 
  Fuel, 
  Settings2, 
  DollarSign, 
  Calendar, 
  Gauge, 
  Check, 
  X,
  SlidersHorizontal
} from 'lucide-react';

const FUEL_OPTIONS = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'MANUAL', label: 'Manual' },
];

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  totalResults,
  isMobileOpen = false,
  onCloseMobile
}) {
  const {
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
  } = filters;

  const activeCount = [
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
  ].filter(Boolean).length;

  const content = (
    <div className="filter-panel-inner">
      {/* Header */}
      <div className="filter-panel-header">
        <div className="filter-panel-title-wrap">
          <SlidersHorizontal size={18} className="filter-header-icon" />
          <span className="filter-title">Filters</span>
          {activeCount > 0 && (
            <span className="filter-active-pill">{activeCount} active</span>
          )}
        </div>
        {activeCount > 0 && (
          <button 
            type="button" 
            onClick={onReset} 
            className="filter-reset-link"
            title="Clear all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
        {onCloseMobile && (
          <button 
            type="button" 
            onClick={onCloseMobile} 
            className="filter-mobile-close-btn"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Fuel Type Group */}
      <div className="filter-group">
        <label className="filter-label">
          <Fuel size={14} />
          <span>Powertrain / Fuel</span>
        </label>
        <div className="filter-chips-grid">
          {FUEL_OPTIONS.map((opt) => {
            const isSelected = fuelType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onChange('fuelType', isSelected ? '' : opt.value)}
              >
                {isSelected && <Check size={12} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission Group */}
      <div className="filter-group">
        <label className="filter-label">
          <Settings2 size={14} />
          <span>Transmission</span>
        </label>
        <div className="filter-chips-grid">
          {TRANSMISSION_OPTIONS.map((opt) => {
            const isSelected = transmission === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onChange('transmission', isSelected ? '' : opt.value)}
              >
                {isSelected && <Check size={12} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-label">
          <DollarSign size={14} />
          <span>Budget Range (₹)</span>
        </label>
        <div className="filter-range-inputs">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="filter-input"
            aria-label="Minimum price in INR"
          />
          <span className="filter-range-sep">—</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="filter-input"
            aria-label="Maximum price in INR"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="filter-group">
        <label className="filter-label">
          <Calendar size={14} />
          <span>Model Year</span>
        </label>
        <div className="filter-range-inputs">
          <input
            type="number"
            placeholder="Min (e.g. 2018)"
            value={minYear}
            onChange={(e) => onChange('minYear', e.target.value)}
            className="filter-input"
            aria-label="Minimum year"
          />
          <span className="filter-range-sep">—</span>
          <input
            type="number"
            placeholder="Max (e.g. 2024)"
            value={maxYear}
            onChange={(e) => onChange('maxYear', e.target.value)}
            className="filter-input"
            aria-label="Maximum year"
          />
        </div>
      </div>

      {/* Mileage Range */}
      <div className="filter-group">
        <label className="filter-label">
          <Gauge size={14} />
          <span>Odometer (mi)</span>
        </label>
        <div className="filter-range-inputs">
          <input
            type="number"
            placeholder="Min mi"
            value={minMileage}
            onChange={(e) => onChange('minMileage', e.target.value)}
            className="filter-input"
            aria-label="Minimum mileage"
          />
          <span className="filter-range-sep">—</span>
          <input
            type="number"
            placeholder="Max mi"
            value={maxMileage}
            onChange={(e) => onChange('maxMileage', e.target.value)}
            className="filter-input"
            aria-label="Maximum mileage"
          />
        </div>
      </div>

      {/* Footer / Mobile apply */}
      {onCloseMobile && (
        <div className="filter-mobile-footer">
          <button 
            type="button" 
            onClick={onCloseMobile} 
            className="btn-primary-action"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Show {totalResults !== undefined ? `${totalResults} Vehicles` : 'Results'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside className="filter-sidebar-rail">
        {content}
      </aside>

      {/* Mobile Drawer / Bottom Sheet */}
      {isMobileOpen && (
        <div className="filter-mobile-backdrop" onClick={onCloseMobile}>
          <div className="filter-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
