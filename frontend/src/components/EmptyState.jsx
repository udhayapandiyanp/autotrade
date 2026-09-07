import React from 'react';
import { Car } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Car,
  title = 'No records found',
  description,
  action,
  secondaryAction
}) {
  return (
    <div className="empty-state-root">
      <div className="empty-state-icon-box">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {(action || secondaryAction) && (
        <div className="empty-state-actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
