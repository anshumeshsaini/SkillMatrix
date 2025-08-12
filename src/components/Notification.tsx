import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';
import React from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  description?: string;
  type?: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Notification: React.FC<NotificationProps> = ({
  message,
  description,
  type = 'info',
  isVisible,
  onClose,
  duration = 5000,
  position = 'top-right',
}) => {
  React.useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColor = {
    success: 'bg-emerald-50/90',
    error: 'bg-rose-50/90',
    warning: 'bg-amber-50/90',
    info: 'bg-blue-50/90',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <div className={`${bgColor[type]} backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 overflow-hidden w-80`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="p-1.5 rounded-lg bg-white/80 shadow-inner">
                    {iconMap[type]}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {message}
                    </h3>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {duration && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for easy usage
export function useNotification() {
  const [notification, setNotification] = React.useState<{
    isVisible: boolean;
    message: string;
    description?: string;
    type?: NotificationType;
  }>({
    isVisible: false,
    message: '',
  });

  const showNotification = (
    message: string,
    options?: {
      description?: string;
      type?: NotificationType;
      duration?: number;
    }
  ) => {
    setNotification({
      isVisible: true,
      message,
      description: options?.description,
      type: options?.type || 'info',
    });
  };

  const NotificationComponent = (
    props?: Omit<NotificationProps, 'message' | 'isVisible' | 'onClose' | 'type'>
  ) => (
    <Notification
      isVisible={notification.isVisible}
      message={notification.message}
      description={notification.description}
      type={notification.type}
      onClose={() => setNotification({ ...notification, isVisible: false })}
      {...props}
    />
  );

  return { showNotification, NotificationComponent };
}

export default Notification;