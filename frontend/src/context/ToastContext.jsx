import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};
const STYLES = {
  success: "border-brand-200 text-brand-800",
  error: "border-red-200 text-red-700",
  info: "border-sky-200 text-sky-700",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-80 max-w-[calc(100vw-2.5rem)]">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              className={`glass-strong flex items-start gap-3 px-4 py-3 animate-slide-in ${STYLES[t.type]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-current/50 hover:text-current">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
