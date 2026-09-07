import React from 'react';

export function VehicleCardSkeleton() {
  return (
    <div className="skeleton-vehicle-card">
      <div className="skeleton-shimmer skeleton-media" />
      <div className="skeleton-content">
        <div className="skeleton-shimmer skeleton-line skeleton-title" />
        <div className="skeleton-shimmer skeleton-line skeleton-price" />
        <div className="skeleton-chips-row">
          <div className="skeleton-shimmer skeleton-chip" />
          <div className="skeleton-shimmer skeleton-chip" />
          <div className="skeleton-shimmer skeleton-chip" />
        </div>
        <div className="skeleton-shimmer skeleton-line skeleton-footer" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="skeleton-table-row">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-shimmer skeleton-line" style={{ height: '18px', width: i === 0 ? '70%' : '50%' }} />
        </td>
      ))}
    </tr>
  );
}

export function DetailShowroomSkeleton() {
  return (
    <div className="skeleton-showroom-root">
      <div className="skeleton-shimmer skeleton-showroom-gallery" />
      <div className="skeleton-showroom-side">
        <div className="skeleton-shimmer skeleton-line" style={{ height: '36px', width: '80%', marginBottom: '1rem' }} />
        <div className="skeleton-shimmer skeleton-line" style={{ height: '32px', width: '40%', marginBottom: '2rem' }} />
        <div className="skeleton-shimmer skeleton-line" style={{ height: '120px', width: '100%', marginBottom: '1.5rem' }} />
        <div className="skeleton-shimmer skeleton-line" style={{ height: '180px', width: '100%' }} />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3, cols = 5 }) {
  if (type === 'card') {
    return (
      <div className="skeleton-cards-grid">
        {Array.from({ length: count }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (type === 'table') {
    return (
      <tbody>
        {Array.from({ length: count }).map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} />
        ))}
      </tbody>
    );
  }
  if (type === 'showroom') {
    return <DetailShowroomSkeleton />;
  }
  return <div className="skeleton-shimmer skeleton-block" />;
}

export function BrandLoadingScreen({ message = "Authenticating with MOLO platform..." }) {
  return (
    <div className="brand-loading-screen" role="status" aria-live="polite">
      <img src="/logo.png" alt="MOLO" className="brand-loading-logo" />
      <div className="brand-loading-spinner" />
      <p className="brand-loading-text">{message}</p>
    </div>
  );
}
