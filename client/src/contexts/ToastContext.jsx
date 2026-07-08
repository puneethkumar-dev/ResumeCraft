import { createContext, useState, useContext, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      duration: 4000,
      variant: "info",
      ...toast
    };
    setToasts((prev) => [...prev, newToast]);

    // Setup auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    danger: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-sky-500" />
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex w-full items-start gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-lg pointer-events-auto"
            >
              <div className="shrink-0 mt-0.5">{icons[t.variant]}</div>
              <div className="flex-1 text-left">
                {t.title && <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight mb-0.5">{t.title}</h4>}
                {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{t.description}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
