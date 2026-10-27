import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: { icon: CheckCircle2, className: "bg-green-50 border-green-100 text-green-700" },
  error: { icon: XCircle, className: "bg-red-50 border-red-100 text-red-600" },
  info: { icon: Info, className: "bg-blue-50 border-blue-100 text-blue-700" },
};

// Wrap your app once with <ToastProvider>, then anywhere:
// const { showToast } = useToast();
// showToast("Job posted successfully", "success");
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = "info", duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const { icon: Icon, className } = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 border rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-[360px] ${className}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
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