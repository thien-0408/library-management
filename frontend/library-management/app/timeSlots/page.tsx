"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { TableSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { isAdminSession } from "@/lib/api";
import { roomBookingApi } from "@/lib/room-booking-api";
import type { TimeSlotResponseDto as TimeSlot } from "@/lib/room-booking-types";

export default function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [slotToDelete, setSlotToDelete] = useState<TimeSlot | null>(null);
  const { toastConfig, showToast, hideToast } = useToast();

  const loadTimeSlots = async () => {
    setIsLoading(true);
    setError("");

    if (!isAdminSession()) {
      setError("Please log in as an admin to manage time slots.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await roomBookingApi.getTimeSlots();
      setTimeSlots(data || []);
    } catch (err: any) {
      setError(err.data?.message || err.message || "Failed to load time slots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const createTimeSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await roomBookingApi.createTimeSlot({ startTime, endTime });
      showToast('Time slot created', 'The new time slot was created successfully.', 'success');
      await loadTimeSlots();
    } catch (err: any) {
      const message = err.data?.message || err.message || "Failed to create time slot";
      setError(message);
      showToast('Create failed', message, 'error');
    }
  };

  const updateTimeSlot = async (slot: TimeSlot) => {
    setError("");
    try {
      await roomBookingApi.updateTimeSlot(slot.id, {
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      showToast('Time slot updated', 'The time slot changes were saved successfully.', 'success');
      await loadTimeSlots();
    } catch (err: any) {
      const message =
        err.data?.message ||
        err.message ||
        "Failed to update time slot. Backend CORS must allow PATCH.";
      setError(message);
      showToast('Update failed', message, 'error');
    }
  };

  const deleteTimeSlot = async () => {
    if (!slotToDelete) return;

    setError("");
    try {
      await roomBookingApi.deleteTimeSlot(slotToDelete.id);
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== slotToDelete.id));
      setSlotToDelete(null);
      showToast('Time slot deleted', 'The time slot was removed successfully.', 'info');
    } catch (err: any) {
      const message = err.data?.message || err.message || "Failed to delete time slot";
      setError(message);
      showToast('Delete failed', message, 'error');
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />
      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl tracking-tight">
            Time Slot Management
          </h1>
          <p className="text-on-surface-variant mt-3 text-lg font-medium">
            Create and manage reservation time windows.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        <form
          onSubmit={createTimeSlot}
          className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end"
        >
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Start time
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border-outline-variant px-4 py-3"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              End time
            </span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border-outline-variant px-4 py-3"
              required
            />
          </label>
          <button className="vibrant-gradient-bg text-white px-6 py-3 rounded-xl font-bold">
            Add Slot
          </button>
        </form>

        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : (
            <table className="w-full text-left">
              <thead className="bg-surface-variant/30 border-b border-outline-variant/50">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">
                    Start
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-on-surface-variant">
                    End
                  </th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-widest text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {timeSlots.map((slot) => (
                  <tr key={slot.id}>
                    <td className="px-6 py-4">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          setTimeSlots((prev) =>
                            prev.map((item) =>
                              item.id === slot.id
                                ? { ...item, startTime: e.target.value }
                                : item,
                            ),
                          )
                        }
                        className="rounded-lg border-outline-variant px-3 py-2"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          setTimeSlots((prev) =>
                            prev.map((item) =>
                              item.id === slot.id
                                ? { ...item, endTime: e.target.value }
                                : item,
                            ),
                          )
                        }
                        className="rounded-lg border-outline-variant px-3 py-2"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => updateTimeSlot(slot)}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setSlotToDelete(slot)}
                        className="px-4 py-2 rounded-lg bg-error/10 text-error font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />

      <ConfirmModal
        isOpen={Boolean(slotToDelete)}
        title="Delete this time slot?"
        description={slotToDelete ? `Remove ${slotToDelete.startTime} - ${slotToDelete.endTime} from available reservation windows.` : ''}
        confirmLabel="Delete time slot"
        variant="danger"
        onCancel={() => setSlotToDelete(null)}
        onConfirm={() => void deleteTimeSlot()}
      />
    </div>
  );
}
