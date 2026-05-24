import { useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type ToastConfig = {
  isVisible: boolean;
  title: string;
  description: string;
  type: ToastType;
};

const initialToast: ToastConfig = {
  isVisible: false,
  title: '',
  description: '',
  type: 'info',
};

export const useToast = () => {
  const [toastConfig, setToastConfig] = useState<ToastConfig>(initialToast);

  const showToast = useCallback((title: string, description = '', type: ToastType = 'info') => {
    setToastConfig({ isVisible: true, title, description, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastConfig((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toastConfig,
    showToast,
    hideToast,
  };
};
