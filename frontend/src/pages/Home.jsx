import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { 
  Search, 
  Car, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Award, 
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

const POPULAR_BRANDS = [
  'All Brands',
  'Porsche',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Tesla',
  'Toyota',
  'Honda',
  'Hyundai',
  'Ford'
];

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Search Bar States
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  // Structured Filters State
  const [filters, setFilters] = useState({
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
  });

  // Pagination & Sorting
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortOption, setSortOption] = useState('createdAt-desc');

  const catalogSectionRef = useRef(null);

  const fetchCatalog = async () => {
    setLoading(true);
    setError('');
    try {
      const [sortBy, sortDir] = sortOption.split('-');
      const params = new URLSearchParams();
      if (make) params.append('make', make);
      if (model) params.append('model', model);
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minYear) params.append('minYear', filters.minYear);
      if (filters.maxYear) params.append('maxYear', filters.maxYear);
      if (filters.minMileage) params.append('minMileage', filters.minMileage);
      if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);
      params.append('page', page);
      params.append('size', 9);
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const data = await apiFetch(`/vehicles?${params.toString()}`);
      setVehicles(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || (data.content ? data.content.length : 0));
    } catch (err) {
      setError(err.message || 'Failed to retrieve marketplace catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [page, sortOption, make, model, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setMake('');
    setModel('');
    setFilters({
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      minMileage: '',
      maxMileage: '',
    });
    setPage(0);
  };

  const handleBrandSelect = (brand) => {
    if (brand === 'All Brands') {
      setMake('');
    } else {
      setMake(brand);
    }
    setPage(0);
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page-root">
      {/* 1. Fullscreen Panoramic Hero Section */}
      <section className="hero-fullscreen-stage">
        <div className="hero-ambient-glow" />
        
        <div className="hero-content-inner">
          <div className="hero-eyebrow-pill">
            <Sparkles size={14} className="hero-sparkle-icon" />
            <span>Next-Generation Automotive Marketplace</span>
          </div>

          <h1 className="hero-headline">
            Buy & Sell Pre-Owned Vehicles <br />
            <span className="hero-headline-accent">With Absolute Confidence</span>
          </h1>

          <p className="hero-subheading">
            Direct peer-to-peer automotive trading with transparent pricing, verified specifications, and direct seller communication.
          </p>

          {/* Quick Search Card Bar */}
          <div className="hero-quick-search-bar">
            <div className="search-field-unit">
              <label className="search-field-label">Make / Brand</label>
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  value={make} 
                  onChange={e => { setMake(e.target.value); setPage(0); }}
                  placeholder="e.g. Porsche, BMW..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="search-field-unit">
              <label className="search-field-label">Model</label>
              <div className="search-input-wrap">
                <Car size={16} className="search-icon" />
                <input 
                  type="text" 
                  value={model} 
                  onChange={e => { setModel(e.target.value); setPage(0); }}
                  placeholder="e.g. 911, M4, Camry..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="search-field-unit">
              <label className="search-field-label">Powertrain</label>
              <select 
                value={filters.fuelType} 
                onChange={e => handleFilterChange('fuelType', e.target.value)}
                className="search-select"
              >
                <option value="">All Fuel Types</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <button 
              type="button" 
              onClick={scrollToCatalog}
              className="btn-hero-search-action"
            >
              <Search size={18} />
              <span>Explore Marketplace</span>
            </button>
          </div>

          {/* Key Trust Signals Row */}
          <div className="hero-metrics-ticker">
            <div className="ticker-item">
              <span className="ticker-value">10,000+</span>
              <span className="ticker-label">Inspected Listings</span>
            </div>
            <div className="ticker-separator" />
            <div className="ticker-item">
              <span className="ticker-value">100%</span>
              <span className="ticker-label">Direct Seller Access</span>
            </div>
            <div className="ticker-separator" />
            <div className="ticker-item">
              <span className="ticker-value">0%</span>
              <span className="ticker-label">Hidden Buyer Markups</span>
            </div>
            <div className="ticker-separator" />
            <div className="ticker-item">
              <span className="ticker-value">Verified</span>
              <span className="ticker-label">Fraud Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Brand Facets Strip */}
      <section className="brand-facets-bar">
        <div className="brand-facets-inner">
          <span className="brand-facets-title">Top Marquees:</span>
          <div className="brand-chips-list">
            {POPULAR_BRANDS.map(brand => {
              const isSelected = (brand === 'All Brands' && !make) || make.toLowerCase() === brand.toLowerCase();
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className={`brand-marquee-chip ${isSelected ? 'active' : ''}`}
                >
                  <Car size={13} />
                  <span>{brand}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Split Catalog & Discovery Section */}
      <section className="catalog-discovery-section" ref={catalogSectionRef}>
        <div className="catalog-discovery-inner">
          {/* Top Catalog Header & Controls Bar */}
          <div className="catalog-control-strip">
            <div className="catalog-results-headline">
              <h2 className="catalog-section-title">Marketplace Inventory</h2>
              <span className="catalog-counter-badge">
                {totalElements} {totalElements === 1 ? 'vehicle' : 'vehicles'} available
              </span>
            </div>

            <div className="catalog-actions-group">
              {/* Mobile Filter Trigger */}
              <button 
                type="button" 
                onClick={() => setMobileFilterOpen(true)} 
                className="btn-mobile-filter-trigger"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="catalog-sort-wrapper">
                <ArrowUpDown size={15} className="sort-icon" />
                <label htmlFor="sort-select" className="sort-label">Sort By:</label>
                <select 
                  id="sort-select"
                  value={sortOption} 
                  onChange={e => {
                    setSortOption(e.target.value);
                    setPage(0);
                  }}
                  className="sort-dropdown-select"
                >
                  <option value="createdAt-desc">Newest Listings First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Model Year: Newest First</option>
                  <option value="mileage-asc">Odometer: Lowest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Split View: Left Sticky Filter Rail + Right Grid */}
          <div className="catalog-split-layout">
            {/* Desktop Filter Sidebar */}
            <FilterPanel 
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={totalElements}
              isMobileOpen={mobileFilterOpen}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />

            {/* Right Vehicle Results Area */}
            <main className="catalog-results-column">
              {loading ? (
                <LoadingSkeleton type="card" count={6} />
              ) : error ? (
                <div className="catalog-error-banner">
                  <p>{error}</p>
                  <button type="button" onClick={fetchCatalog} className="btn-secondary-action">
                    Retry
                  </button>
                </div>
              ) : vehicles.length === 0 ? (
                <EmptyState 
                  icon={Car}
                  title="No vehicles match your criteria"
                  description="Try adjusting your make, price threshold, or year parameters to discover available listings."
                  action={
                    <button type="button" onClick={handleResetFilters} className="btn-primary-action">
                      Clear All Filters
                    </button>
                  }
                />
              ) : (
                <>
                  <div className="vehicles-cards-grid">
                    {vehicles.map(v => (
                      <VehicleCard key={v.id} vehicle={v} />
                    ))}
                  </div>

                  {/* Pagination Bar */}
                  {totalPages > 1 && (
                    <div className="catalog-pagination-bar">
                      <button 
                        type="button"
                        disabled={page === 0} 
                        onClick={() => {
                          setPage(prev => prev - 1);
                          scrollToCatalog();
                        }} 
                        className="pagination-nav-btn"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </button>
                      
                      <div className="pagination-pages-indicator">
                        Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
                      </div>

                      <button 
                        type="button"
                        disabled={page >= totalPages - 1} 
                        onClick={() => {
                          setPage(prev => prev + 1);
                          scrollToCatalog();
                        }} 
                        className="pagination-nav-btn"
                        aria-label="Next page"
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* 4. Trust & Security Architecture */}
      <section className="platform-trust-section">
        <div className="platform-trust-inner">
          <div className="trust-header-center">
            <span className="trust-sub-badge">Trust Architecture</span>
            <h2 className="trust-main-heading">Why Discerning Drivers Choose AutoTrade</h2>
            <p className="trust-subtext">
              We eliminated the middleman fees and replaced ambiguous dealer markups with verified transparency.
            </p>
          </div>

          <div className="trust-pillars-grid">
            <div className="trust-pillar-card">
              <div className="pillar-icon-box box-blue">
                <ShieldCheck size={26} />
              </div>
              <h3 className="pillar-title">100% Direct Inquiries</h3>
              <p className="pillar-desc">
                Communicate directly with verified vehicle owners. Schedule inspections, negotiate terms, and finalize deals without third-party commission overhead.
              </p>
            </div>

            <div className="trust-pillar-card">
              <div className="pillar-icon-box box-emerald">
                <Zap size={26} />
              </div>
              <h3 className="pillar-title">Transparent INR Pricing</h3>
              <p className="pillar-desc">
                Every asking price is listed cleanly with zero hidden dealership administrative fees or documentation surcharges.
              </p>
            </div>

            <div className="trust-pillar-card">
              <div className="pillar-icon-box box-amber">
                <Award size={26} />
              </div>
              <h3 className="pillar-title">Standardized Specs</h3>
              <p className="pillar-desc">
                High-fidelity technical matrices for fuel type, transmission, verified odometer readings, and comprehensive photo galleries.
              </p>
            </div>

            <div className="trust-pillar-card">
              <div className="pillar-icon-box box-rose">
                <Lock size={26} />
              </div>
              <h3 className="pillar-title">Anti-Fraud Moderation</h3>
              <p className="pillar-desc">
                Continuous community moderation and admin oversight to quickly review, investigate, and purge inaccurate or misleading listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seller Conversion Call-to-Action Banner */}
      <section className="seller-conversion-banner">
        <div className="seller-banner-inner">
          <div className="seller-banner-text">
            <h2 className="seller-banner-heading">Looking to Sell Your Pre-Owned Car?</h2>
            <p className="seller-banner-desc">
              List your vehicle on AutoTrade in minutes. Connect with serious automotive buyers, manage inquiries in real-time, and control your listing terms.
            </p>
            <div className="seller-bullet-points">
              <div className="bullet-point">
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>Zero listing fees</span>
              </div>
              <div className="bullet-point">
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>Direct inquiries sent to your dashboard</span>
              </div>
              <div className="bullet-point">
                <CheckCircle2 size={16} className="bullet-icon" />
                <span>Publish or pause anytime</span>
              </div>
            </div>
          </div>

          <div className="seller-banner-action-area">
            <Link to="/seller/vehicles/new" className="btn-seller-cta">
              <span>List Your Car Today</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
