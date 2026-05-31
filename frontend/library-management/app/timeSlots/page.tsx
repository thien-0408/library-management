"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Toast from "@/components/toast_notification";
import ConfirmModal from "@/components/confirm_modal";
import { TableSkeleton } from "@/components/skeleton_loader";
import { useToast } from "@/hooks/useToast";
import { isAdminSession } from "@/lib/api";
import { roomBookingApi } from "@/lib/room-booking-api";
import type { TimeSlotResponseDto as TimeSlot } from "@/lib/room-booking-types";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const maybeError = error as {
      data?: { message?: string };
      message?: string;
    };
    return maybeError.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

export default function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [slotToDelete, setSlotToDelete] = useState<TimeSlot | null>(null);
  const [dirtySlotIds, setDirtySlotIds] = useState<Set<string>>(new Set());
  const { toastConfig, showToast, hideToast } = useToast();

  const formatSlotLabel = (value: string) => value.slice(0, 5);

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
      setDirtySlotIds(new Set());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load time slots"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTimeSlots();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const createTimeSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await roomBookingApi.createTimeSlot({ startTime, endTime });
      showToast(
        "Time slot created",
        "The new time slot was created successfully.",
        "success",
      );
      await loadTimeSlots();
    } catch (err) {
      const message = getErrorMessage(err, "Failed to create time slot");
      setError(message);
      showToast("Create failed", message, "error");
    }
  };

  const updateTimeSlot = async (slot: TimeSlot) => {
    setError("");
    try {
      await roomBookingApi.updateTimeSlot(slot.id, {
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      showToast(
        "Time slot updated",
        "The time slot changes were saved successfully.",
        "success",
      );
      await loadTimeSlots();
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to update time slot. Backend CORS must allow PATCH.",
      );
      setError(message);
      showToast("Update failed", message, "error");
    }
  };

  const deleteTimeSlot = async () => {
    if (!slotToDelete) return;

    setError("");
    try {
      await roomBookingApi.deleteTimeSlot(slotToDelete.id);
      setTimeSlots((prev) =>
        prev.filter((slot) => slot.id !== slotToDelete.id),
      );
      setSlotToDelete(null);
      showToast(
        "Time slot deleted",
        "The time slot was removed successfully.",
        "info",
      );
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete time slot");
      setError(message);
      showToast("Delete failed", message, "error");
    }
  };

  const totalSlots = timeSlots.length;
  const firstSlot = timeSlots[0];
  const lastSlot = timeSlots[timeSlots.length - 1];

  const updateSlotField = (
    slotId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setTimeSlots((prev) =>
      prev.map((item) =>
        item.id === slotId ? { ...item, [field]: value } : item,
      ),
    );
    setDirtySlotIds((prev) => new Set(prev).add(slotId));
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] font-body text-[#1f2420]">
      <Header />
      <main className="app-shell-main app-shell-content page-shell mx-auto max-w-7xl px-5 pb-16 md:px-8 xl:px-10">
        {error && (
          <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700 shadow-sm">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[20rem_1fr] lg:items-start">
          <form
            onSubmit={createTimeSlot}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(57,47,32,0.45)] lg:sticky lg:top-8"
          >
            <div className="mb-4 border-b border-stone-200 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">
                Create window
              </p>
              <h2 className="mt-1 font-headline text-xl font-black tracking-[-0.03em] text-stone-900">
                Add a new slot
              </h2>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                  Start time
                </span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 outline-none transition focus:border-[#1f3d35] focus:ring-2 focus:ring-[#1f3d35]/10"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                  End time
                </span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 outline-none transition focus:border-[#1f3d35] focus:ring-2 focus:ring-[#1f3d35]/10"
                  required
                />
              </label>
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f3d35] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#274c42] active:scale-[0.99]">
              <i className="fa-solid fa-plus"></i>
              Add time slot
            </button>
          </form>

          <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_18px_40px_-34px_rgba(57,47,32,0.45)]">
            <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-headline text-xl font-black tracking-[-0.03em] text-stone-900">
                  Reservation windows
                </h2>
              </div>
              <span className="w-fit rounded-md bg-stone-100 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-stone-600">
                {totalSlots} total ·{" "}
                {firstSlot && lastSlot
                  ? `${formatSlotLabel(firstSlot.startTime)}-${formatSlotLabel(lastSlot.endTime)}`
                  : "--"}
              </span>
            </div>

            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : timeSlots.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eef3ef] text-2xl text-[#1f3d35]">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <h3 className="mt-5 font-headline text-2xl font-black text-[#20231f]">
                  No time slots yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#6f746e]">
                  Create the first reservation window to make room booking
                  schedules available.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="border-b border-stone-200 bg-stone-50/80">
                    <tr>
                      <th className="w-16 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                        #
                      </th>
                      <th className="px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                        Window
                      </th>
                      <th className="px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                        Start
                      </th>
                      <th className="px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                        End
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {timeSlots.map((slot, index) => (
                      <tr
                        key={slot.id}
                        className="group transition hover:bg-stone-50/80"
                      >
                        <td className="px-5 py-3 align-middle font-mono text-sm font-semibold text-stone-400">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-3 align-middle">
                          <p className="font-headline text-lg font-black text-stone-900">
                            {formatSlotLabel(slot.startTime)} -{" "}
                            {formatSlotLabel(slot.endTime)}
                          </p>
                        </td>
                        <td className="px-5 py-3 align-middle">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              updateSlotField(
                                slot.id,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-stone-800 outline-none transition hover:border-stone-200 hover:bg-white focus:border-[#1f3d35] focus:bg-white focus:ring-2 focus:ring-[#1f3d35]/10"
                          />
                        </td>
                        <td className="px-5 py-3 align-middle">
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              updateSlotField(
                                slot.id,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-stone-800 outline-none transition hover:border-stone-200 hover:bg-white focus:border-[#1f3d35] focus:bg-white focus:ring-2 focus:ring-[#1f3d35]/10"
                          />
                        </td>
                        <td className="px-5 py-3 text-right align-middle">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateTimeSlot(slot)}
                              disabled={!dirtySlotIds.has(slot.id)}
                              className="rounded-md px-3 py-1.5 text-xs font-black text-[#1f3d35] transition hover:bg-[#eef3ef] disabled:pointer-events-none disabled:opacity-0 group-hover:disabled:opacity-35"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${formatSlotLabel(slot.startTime)} - ${formatSlotLabel(slot.endTime)}`}
                              onClick={() => setSlotToDelete(slot)}
                              className="grid h-8 w-8 place-items-center rounded-md text-stone-400 transition hover:bg-red-50 hover:text-red-700"
                            >
                              <i className="fa-regular fa-trash-can text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
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
        description={
          slotToDelete
            ? `Remove ${slotToDelete.startTime} - ${slotToDelete.endTime} from available reservation windows.`
            : ""
        }
        confirmLabel="Delete time slot"
        variant="danger"
        onCancel={() => setSlotToDelete(null)}
        onConfirm={() => void deleteTimeSlot()}
      />
    </div>
  );
}
