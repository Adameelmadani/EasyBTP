import { Building2 } from "lucide-react";

export default function ProjectPicker({ projects, value, onChange, allowAll = false, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
      <select className="select pl-9 min-w-[200px]" value={value} onChange={(e) => onChange(e.target.value)}>
        {allowAll && <option value="">Tous les projets</option>}
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
