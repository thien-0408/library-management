import React from 'react';
import { PendingRequest } from '../types';

interface RequestQueueProps {
  requests: PendingRequest[];
  onApprove: (req: PendingRequest) => void;
  onReject: (req: PendingRequest) => void;
}

const RequestQueue: React.FC<RequestQueueProps> = ({ requests, onApprove, onReject }) => {
  return (
    <div className="h-fit rounded-[2rem] border border-outline-variant bg-[var(--catalog-panel)] p-8 shadow-soft-card">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-black text-on-surface">Request Queue</h3>
        {requests.length > 0 && (
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black text-on-primary shadow-sm">
            {requests.length} PENDING
          </span>
        )}
      </div>

      <div className="space-y-5">
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-clipboard-check text-4xl text-primary-container mb-3"></i>
            <p className="font-black text-on-surface-variant">All caught up!</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="rounded-2xl border border-outline-variant bg-surface-variant/50 p-5 shadow-sm transition-all hover:bg-[var(--catalog-panel)] hover:shadow-md">
              <div className="flex gap-4 items-center mb-5">
                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-container" src={req.avatar} alt={req.userName} />
                <div>
                  <p className="text-sm font-black text-on-surface">{req.userName}</p>
                  <p className="mt-0.5 text-xs font-medium text-on-surface-variant"><i className="fa-solid fa-book mr-1 text-primary"></i> {req.bookTitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onApprove(req)} className="rounded-xl bg-primary py-2.5 text-xs font-black text-on-primary shadow-sm transition-all hover:bg-[#274c42] active:scale-95">
                  Approve
                </button>
                <button onClick={() => onReject(req)} className="rounded-xl bg-white/80 py-2.5 text-xs font-black text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {requests.length > 0 && (
        <button className="mt-6 w-full rounded-2xl border border-outline-variant bg-primary-container py-3.5 text-sm font-black text-on-primary-container transition-all hover:bg-[#cfe0d2]">
          View All Requests
        </button>
      )}
    </div>
  );
};

export default RequestQueue;
