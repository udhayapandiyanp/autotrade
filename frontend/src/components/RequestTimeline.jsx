import React from 'react';
import { CheckCircle2, Clock, XCircle, Send } from 'lucide-react';

export default function RequestTimeline({ status = 'PENDING', date }) {
  const isDeclined = status === 'DECLINED';
  const isAccepted = status === 'ACCEPTED';
  const isPending = status === 'PENDING';

  return (
    <div className="request-timeline-root">
      {/* Step 1 */}
      <div className="timeline-step step-completed">
        <div className="timeline-node">
          <Send size={13} />
        </div>
        <div className="timeline-content">
          <span className="timeline-label">Inquiry Sent</span>
          {date && <span className="timeline-meta">{new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className={`timeline-connector ${!isPending ? 'connector-active' : ''}`} />

      {/* Step 2 */}
      <div className={`timeline-step ${isPending ? 'step-current' : 'step-completed'}`}>
        <div className="timeline-node">
          <Clock size={13} />
        </div>
        <div className="timeline-content">
          <span className="timeline-label">Seller Review</span>
          <span className="timeline-meta">{isPending ? 'In Progress' : 'Completed'}</span>
        </div>
      </div>

      <div className={`timeline-connector ${!isPending ? 'connector-active' : ''}`} />

      {/* Step 3 */}
      <div className={`timeline-step ${isAccepted ? 'step-completed-success' : isDeclined ? 'step-declined' : 'step-upcoming'}`}>
        <div className="timeline-node">
          {isDeclined ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
        </div>
        <div className="timeline-content">
          <span className="timeline-label">
            {isAccepted ? 'Inquiry Accepted' : isDeclined ? 'Inquiry Declined' : 'Direct Contact'}
          </span>
          <span className="timeline-meta">
            {isAccepted ? 'Seller Connected' : isDeclined ? 'Closed by Seller' : 'Awaiting Decision'}
          </span>
        </div>
      </div>
    </div>
  );
}
