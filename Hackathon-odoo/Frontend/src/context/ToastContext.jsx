import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import ToastMessage from '../components/ToastMessage';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => setToasts((s) => s.filter((x) => x.id !== id));

  const push = (t) => {
    const id = Date.now().toString();
    const { type = 'info', ...rest } = t;
    setToasts((s) => [...s, { id, type, ...rest }]);
    setTimeout(() => removeToast(id), 4000);
  };

  // Helper shortcuts
  const success = (opts) => push({ ...opts, type: 'success' });
  const error = (opts) => push({ ...opts, type: 'error' });
  const warning = (opts) => push({ ...opts, type: 'warning' });
  const info = (opts) => push({ ...opts, type: 'info' });

  return (
    <ToastContext.Provider value={{ toasts, push, success, error, warning, info }}>
      {children}
        <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 space-y-2">
          {toasts.map((t) => (
            <ToastMessage key={t.id} toast={t} onClose={removeToast} />
          ))}
        </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
