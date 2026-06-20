import { useEffect } from "react";
import { X, Loader2, Inbox } from "lucide-react";

export function Card({ className = "", children, hover = false, ...props }) {
  return (
    <div className={`glass p-5 ${hover ? "card-hover" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow shrink-0">
            <Icon size={24} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-brand-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-brand-700/70 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, tint = "brand", className = "" }) {
  const tints = {
    brand: "from-brand-500 to-brand-700",
    amber: "from-amber-400 to-amber-600",
    sky: "from-sky-400 to-sky-600",
    red: "from-red-400 to-red-600",
    indigo: "from-indigo-400 to-indigo-600",
  };
  return (
    <Card hover className={`flex items-start gap-4 ${className}`}>
      {Icon && (
        <div className={`grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br ${tints[tint]} text-white shadow-md shrink-0`}>
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700/60">{label}</p>
        <p className="text-2xl font-bold text-brand-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-brand-700/60 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

export function ProgressBar({ value = 0, className = "", showLabel = false }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2.5 rounded-full bg-brand-100/70 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-brand-700 w-9 text-right">{Math.round(v)}%</span>}
    </div>
  );
}

export function Spinner({ className = "" }) {
  return (
    <div className={`grid place-items-center py-16 ${className}`}>
      <Loader2 className="animate-spin text-brand-500" size={32} />
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title = "Aucune donnée", subtitle, action }) {
  return (
    <div className="grid place-items-center py-16 text-center">
      <div className="grid place-items-center w-16 h-16 rounded-3xl bg-brand-50 text-brand-400 mb-3">
        <Icon size={30} />
      </div>
      <p className="font-semibold text-brand-800">{title}</p>
      {subtitle && <p className="text-sm text-brand-700/60 mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-brand-900/20 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className={`glass-strong w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-brand-100/70 sticky top-0 bg-white/70 backdrop-blur-xl z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-brand-900">{title}</h3>
          <button onClick={onClose} className="text-brand-500 hover:text-brand-800 hover:bg-brand-50 rounded-lg p-1.5 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
    </div>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}
export function Textarea(props) {
  return <textarea className="textarea" rows={3} {...props} />;
}
export function Select({ children, ...props }) {
  return (
    <select className="select" {...props}>
      {children}
    </select>
  );
}

export function Avatar({ name = "", size = 36 }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="grid place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-white/50 backdrop-blur border border-white/60 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
            active === t.value ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow" : "text-brand-700/70 hover:bg-white/70"
          }`}
        >
          {t.icon && <t.icon size={16} />}
          {t.label}
          {t.count != null && (
            <span className={`text-xs px-1.5 rounded-full ${active === t.value ? "bg-white/25" : "bg-brand-100 text-brand-700"}`}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
