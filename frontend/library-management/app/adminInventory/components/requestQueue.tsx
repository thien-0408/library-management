import React from 'react';
import { PendingRequest } from '../types';

interface RequestQueueProps {
  requests: PendingRequest[];
  onApprove: (req: PendingRequest) => void;
  onReject: (req: PendingRequest) => void;
}

const RequestQueue: React.FC<RequestQueueProps> = ({ requests, onApprove, onReject }) => {
  return (
    <div className="h-fit rounded-[2rem] border border-red-100 bg-white p-8 shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-black text-slate-950">Request Queue</h3>
        {requests.length > 0 && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black text-white shadow-sm">
            {requests.length} PENDING
          </span>
        )}
      </div>

      <div className="space-y-5">
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <i className="fa-solid fa-clipboard-check text-4xl text-slate-300 mb-3"></i>
            <p className="font-black text-slate-500">All caught up!</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="rounded-2xl border border-red-100 bg-red-50/50 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md">
              <div className="flex gap-4 items-center mb-5">
                <img className="h-12 w-12 rounded-full object-cover ring-2 ring-red-100" src={req.avatar} alt={req.userName} />
                <div>
                  <p className="text-sm font-black text-slate-950">{req.userName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500"><i className="fa-solid fa-book mr-1 text-red-500"></i> {req.bookTitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onApprove(req)} className="rounded-xl bg-red-600 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:bg-red-700 active:scale-95">
                  Approve
                </button>
                <button onClick={() => onReject(req)} className="rounded-xl bg-white py-2.5 text-xs font-black text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {requests.length > 0 && (
        <button className="mt-6 w-full rounded-2xl border border-red-100 bg-red-50 py-3.5 text-sm font-black text-red-700 transition-all hover:bg-red-100">
          View All Requests
        </button>
      )}
    </div>
  );
};

export default RequestQueue;
