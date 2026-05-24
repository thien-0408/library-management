import React from 'react';
import { PendingRequest } from '../types';

interface RequestQueueProps {
  requests: PendingRequest[];
  onApprove: (req: PendingRequest) => void;
  onReject: (req: PendingRequest) => void;
}

const RequestQueue: React.FC<RequestQueueProps> = ({ requests, onApprove, onReject }) => {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/50 shadow-sm h-fit">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline font-bold text-xl">Request Queue</h3>
        {requests.length > 0 && (
          <span className="vibrant-gradient-bg text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
            {requests.length} PENDING
          </span>
        )}
      </div>

      <div className="space-y-5">
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-clipboard-check text-4xl text-slate-300 mb-3"></i>
            <p className="text-on-surface-variant font-bold">All caught up!</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-4 items-center mb-5">
                <img className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-variant" src={req.avatar} alt={req.userName} />
                <div>
                  <p className="text-sm font-bold text-on-surface">{req.userName}</p>
                  <p className="text-xs text-on-surface-variant/80 font-medium mt-0.5"><i className="fa-solid fa-book text-primary/70 mr-1"></i> {req.bookTitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onApprove(req)} className="py-2.5 rounded-lg vibrant-gradient-bg text-white text-xs font-bold hover:brightness-110 transition-all active:scale-95 shadow-sm">
                  Approve
                </button>
                <button onClick={() => onReject(req)} className="py-2.5 rounded-lg bg-surface-variant text-on-surface-variant text-xs font-bold hover:bg-error/10 hover:text-error transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {requests.length > 0 && (
        <button className="w-full mt-6 py-3.5 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all border border-primary/10">
          View All Requests
        </button>
      )}
    </div>
  );
};

export default RequestQueue;
