'use client';

import { X, Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-500'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  }
};

export function Toast({ id, type, message, duration = 5000, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = TOAST_CONFIG[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <Icon size={20} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm ${config.textColor} leading-relaxed`}>{message}</p>
      <button
        onClick={handleDismiss}
        className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const POSITION_CLASSES = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
};

export function ToastContainer({ toasts, onDismiss, position = 'top-right' }: ToastContainerProps) {
  return (
    <div className={`fixed ${POSITION_CLASSES[position]} z-50 flex flex-col gap-2`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
