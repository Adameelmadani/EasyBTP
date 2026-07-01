import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmContext = createContext(null);

/**
 * Remplace le confirm() natif par une boîte de dialogue stylée (glassmorphism).
 * Usage : const confirm = useConfirm();  if (!(await confirm("Message ?"))) return;
 * On peut passer une chaîne ou un objet { title, message, confirmLabel, cancelLabel, tone }.
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => {
    const cfg = typeof opts === "string" ? { message: opts } : opts || {};
    return new Promise((resolve) => {
      resolver.current = resolve;
      setState({
        title: cfg.title || "Confirmer l'action",
        message: cfg.message || "Êtes-vous sûr de vouloir continuer ?",
        confirmLabel: cfg.confirmLabel || "Confirmer",
        cancelLabel: cfg.cancelLabel || "Annuler",
        tone: cfg.tone || "danger",
      });
    });
  }, []);

  const close = useCallback((result) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state, close]);

  const danger = state?.tone === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-[110] grid place-items-center p-4 bg-brand-900/20 backdrop-blur-sm animate-fade-in"
          onClick={() => close(false)}
        >
          <div className="glass-strong w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`grid place-items-center w-11 h-11 rounded-2xl ring-1 shrink-0 ${
                    danger ? "text-red-500 ring-red-500/20 bg-red-50/70" : "text-brand-600 ring-brand-500/20 bg-brand-50/70"
                  }`}
                >
                  <AlertTriangle size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-brand-900">{state.title}</h3>
                  <p className="text-sm text-brand-700/80 mt-1 whitespace-pre-line">{state.message}</p>
                </div>
                <button
                  onClick={() => close(false)}
                  className="text-brand-400 hover:text-brand-800 hover:bg-brand-50 rounded-lg p-1 transition shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button className="btn-ghost" onClick={() => close(false)}>{state.cancelLabel}</button>
                <button className={danger ? "btn-danger" : "btn-primary"} onClick={() => close(true)}>
                  {state.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
