import React from 'react';
import { PendingRequest } from '../types';

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  return (
    <div className="sticky top-24 flex h-full flex-col rounded-[2rem] border border-red-100 bg-white p-6 shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
      <h2 className="mb-6 flex items-center gap-3 font-headline text-xl font-black text-slate-950">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"><i className="fa-solid fa-clipboard-list"></i></span> Pending Requests
      </h2>

      <div className="flex flex-col gap-4">
        {requests.map(req => (
          <div key={req.id} className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md">
            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <i className="fa-solid fa-hourglass-half"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black leading-snug text-slate-950">{req.title}</h4>
              <p className="mt-1 text-[10px] font-bold text-slate-400">ID: {req.reqId}</p>
              <div className="mt-3">
                {req.status === 'In Processing' ? (
                  <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-700">
                    In Processing
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Queue: #{req.queueNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Info Tip */}
        <div className="mt-6 border-t border-red-100 pt-6">
          <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
            <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-lg text-red-600"></i>
            <p className="text-xs leading-relaxed text-slate-500">
              <strong className="font-black text-slate-950">Quick Tip:</strong> You can have up to 5 concurrent requests. Visit the reception for special archival access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsList;
