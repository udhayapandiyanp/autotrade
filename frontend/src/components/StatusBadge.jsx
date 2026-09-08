import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Archive, 
  Tag, 
  AlertCircle, 
  XCircle, 
  ShieldCheck 
} from 'lucide-react';

const STATUS_CONFIG = {
  // Vehicle Statuses
  PUBLISHED: { label: 'Active', color: 'emerald', icon: CheckCircle2 },
  DRAFT: { label: 'Draft', color: 'amber', icon: Clock },
  SOLD: { label: 'Sold', color: 'slate', icon: Tag },
  ARCHIVED: { label: 'Archived', color: 'slate', icon: Archive },
  
  // Request Statuses
  PENDING: { label: 'Pending Review', color: 'amber', icon: Clock },
  ACCEPTED: { label: 'Inquiry Accepted', color: 'emerald', icon: CheckCircle2 },
  DECLINED: { label: 'Declined', color: 'rose', icon: XCircle },
  
  // Moderation Statuses
  RESOLVED: { label: 'Resolved', color: 'emerald', icon: ShieldCheck },
  REPORTED: { label: 'Flagged', color: 'rose', icon: AlertCircle },

  // Report Reasons
  FRAUD: { label: 'Suspected Fraud', color: 'rose', icon: AlertCircle },
  SPAM: { label: 'Spam / Duplicate', color: 'amber', icon: AlertCircle },
  INACCURATE: { label: 'Inaccurate Info', color: 'amber', icon: AlertCircle },
};

export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return null;
  const key = String(status).toUpperCase();
  const config = STATUS_CONFIG[key] || { label: status, color: 'slate', icon: Tag };
  const Icon = config.icon;

  return (
    <span className={`status-badge-root status-badge-${config.color} status-badge-${size}`}>
      <Icon size={size === 'sm' ? 12 : 14} className="status-badge-icon" />
      <span>{config.label}</span>
    </span>
  );
}
