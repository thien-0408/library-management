import React from 'react';
import { PendingRequest } from '../types';

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-[var(--catalog-panel)] p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-3 border-b border-outline-variant pb-3 font-headline text-xl font-black text-on-surface">
        <span className="grid h-8 w-8 place-items-center rounded bg-primary-container text-sm text-primary"><i className="fa-solid fa-clipboard-list"></i></span> 
        Pending Requests
      </h2>

      <div className="flex flex-col gap-4">
        {requests.map(req => (
          <div key={req.id} className="flex items-start gap-4 rounded-lg border border-outline-variant bg-surface-variant/30 p-4 transition-all hover:bg-[var(--catalog-panel)] hover:shadow-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-xs text-on-primary">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black leading-snug text-on-surface">{req.title}</h4>
              <p className="mt-1 text-[10px] font-bold text-on-surface-variant/70">ID: {req.reqId}</p>
              <div className="mt-2.5">
                {req.status === 'In Processing' ? (
                  <span className="inline-block rounded bg-primary-container px-2 py-1 text-[9px] font-black uppercase tracking-wider text-on-primary-container">
                    In Processing
                  </span>
                ) : (
                  <span className="inline-block rounded border border-outline-variant bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wider text-on-surface-variant">
                    Queue: #{req.queueNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Info Tip */}
        <div className="mt-6 border-t border-outline-variant pt-6">
          <div className="flex gap-3 rounded-lg border border-outline-variant bg-primary-container/50 p-4">
            <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-primary"></i>
            <p className="text-xs font-medium leading-relaxed text-on-surface-variant">
              <strong className="font-black text-on-surface">Quick Tip:</strong> You can have up to 5 concurrent requests. Visit the reception for special archival access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsList;
