import React from 'react';

export default function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend,
  color = 'brand' 
}) {
  return (
    <div className={`stat-card-root stat-card-theme-${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrap">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      </div>
      {trend && (
        <div className="stat-card-trend">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
