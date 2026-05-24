'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  isVisible: boolean;
  type: ToastType;
  title: string;
  description?: string;
  onClose: () => void;
}

const toastStyles: Record<ToastType, { icon: string; accent: string; bg: string }> = {
  success: {
    icon: 'fa-circle-check',
    accent: 'text-green-600',
    bg: 'bg-green-50 border-green-100',
  },
  error: {
    icon: 'fa-circle-xmark',
    accent: 'text-red-600',
    bg: 'bg-red-50 border-red-100',
  },
  info: {
    icon: 'fa-circle-info',
    accent: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
  },
};

export default function Toast({ isVisible, type, title, description, onClose }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;

    AOS.refreshHard();
    const timeoutId = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const style = toastStyles[type];

  return (
    <div
      data-aos="fade-left"
      data-aos-duration="300"
      data-aos-offset="0"
      className="fixed top-6 right-6 z-[200] w-[calc(100%-3rem)] max-w-sm"
    >
      <div className={`rounded-2xl border shadow-lg p-4 flex items-start gap-3 ${style.bg}`}>
        <i className={`fa-solid ${style.icon} mt-0.5 text-xl ${style.accent}`}></i>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 leading-snug">{title}</p>
          {description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close notification"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
