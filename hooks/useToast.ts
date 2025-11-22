'use client';

import { useState, useCallback } from 'react';
import { ToastType } from '@/components/ui/Toast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    info: useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast]),
    success: useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast]),
    warning: useCallback((message: string, duration?: number) => addToast('warning', message, duration), [addToast]),
    error: useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast])
  };

  return {
    toasts,
    toast,
    removeToast
  };
}
