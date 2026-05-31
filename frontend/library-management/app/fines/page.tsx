'use client';

import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import { ListSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useFines } from './hooks/useFines';
import type { FineStatus } from './types';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const formatCurrency = (amount: number) => `${amount.toLocaleString()} VND`;

const fineStatuses: FineStatus[] = ['UNPAID', 'PAID', 'WAIVED'];

export default function FinesPage() {
  const {
    fines,
    isAdmin,
    isLoading,
    isUpdating,
    error,
    generateOverdueFines,
    updateFineStatus,
    refreshData,
  } = useFines();
  const { toastConfig, showToast, hideToast } = useToast();
  const unpaidFines = fines.filter((fine) => fine.status === 'UNPAID');
  const unpaidAmount = unpaidFines.reduce((total, fine) => total + fine.amount, 0);
  const resolvedCount = fines.filter((fine) => fine.status === 'PAID' || fine.status === 'WAIVED').length;

  const handleGenerateOverdueFines = async () => {
    const success = await generateOverdueFines();
    if (success) {
      showToast('Fines generated', 'Overdue fines were generated successfully.', 'success');
    } else {
      showToast('Generation failed', 'Overdue fines could not be generated.', 'error');
    }
  };

  const handleUpdateFineStatus = async (id: string, status: FineStatus) => {
    const success = await updateFineStatus(id, status);
    if (success) {
      showToast('Fine updated', `Fine status changed to ${status}.`, 'success');
    } else {
      showToast('Update failed', 'The fine status could not be updated.', 'error');
    }
  };

  return (
    <div className="bg-[#f4f0e8] font-body text-on-surface min-h-screen">
      <Header />
      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight">Fines</h1>
            <p className="mt-3 text-on-surface-variant text-lg">
              {isAdmin
                ? 'Review and manage overdue fines across the library system.'
                : 'Review your overdue fines and payment status.'}
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => void handleGenerateOverdueFines()}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate overdue fines
            </button>
          )}
        </div>

        {error && (
          <div className="text-center py-5 bg-red-50 text-red-600 rounded-2xl mb-8 border border-red-200">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
            <button onClick={refreshData} className="ml-4 underline text-sm">Retry</button>
          </div>
        )}

        {!isLoading && !error && (
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant/70">Unpaid fines</p>
              <p className="mt-3 text-3xl font-extrabold text-error">{unpaidFines.length}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant/70">Amount due</p>
              <p className="mt-3 text-3xl font-extrabold text-primary">{formatCurrency(unpaidAmount)}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant/70">Resolved</p>
              <p className="mt-3 text-3xl font-extrabold text-green-700">{resolvedCount}</p>
            </div>
          </section>
        )}

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : fines.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center shadow-sm">
            <h2 className="font-headline text-2xl font-bold">No fines found</h2>
            <p className="mt-3 text-on-surface-variant">
              {isAdmin ? 'There are no overdue fines to display right now.' : 'You do not have any fines right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {fines.map((fine) => (
              <article key={fine.id} className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                        {fine.status}
                      </span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(fine.amount)}</span>
                    </div>

                    <div>
                      <h2 className="font-headline text-2xl font-bold">{fine.bookTitle}</h2>
                      <p className="mt-2 text-on-surface-variant">ISBN: {fine.bookIsbn}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 rounded-xl bg-surface-variant/30 p-4">
                      {isAdmin && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">User</p>
                          <p className="mt-1 font-bold text-on-surface">{fine.userName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">Overdue days</p>
                        <p className="mt-1 font-bold text-on-surface">{fine.overdueDays}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">Created</p>
                        <p className="mt-1 font-bold text-on-surface">{formatDateTime(fine.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">Resolved</p>
                        <p className="mt-1 font-bold text-on-surface">{formatDateTime(fine.resolvedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="w-full xl:w-56 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Update status
                      </label>
                      <select
                        value={fine.status}
                        disabled={isUpdating}
                        onChange={(event) => void handleUpdateFineStatus(fine.id, event.target.value as FineStatus)}
                        className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 font-semibold"
                      >
                        {fineStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />
    </div>
  );
}
