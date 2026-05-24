import React from 'react';
import { PendingRequest } from '../types';

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  return (
    <div className="bg-surface-container-high rounded-2xl p-6 h-full flex flex-col border border-outline-variant/50 sticky top-24">
      <h2 className="text-xl font-bold font-headline flex items-center gap-3 mb-6">
        <i className="fa-solid fa-clipboard-list text-primary"></i> Pending Requests
      </h2>

      <div className="flex flex-col gap-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-5 rounded-xl flex items-start gap-4 border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mt-1">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-on-surface leading-snug">{req.title}</h4>
              <p className="text-[10px] font-medium text-on-surface-variant/70 mt-1">ID: {req.reqId}</p>
              <div className="mt-3">
                {req.status === 'In Processing' ? (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    In Processing
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    Queue: #{req.queueNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Info Tip */}
        <div className="mt-6 pt-6 border-t border-outline-variant/50">
          <div className="bg-white p-4 rounded-xl border border-primary/20 flex gap-3">
            <i className="fa-solid fa-circle-info text-primary text-lg shrink-0 mt-0.5"></i>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface font-bold">Quick Tip:</strong> You can have up to 5 concurrent requests. Visit the reception for special archival access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsList;
