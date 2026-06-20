import { useEffect, useState } from "react";
import { ScrollText, Filter } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, Card, Spinner, EmptyState, Badge, Avatar } from "../components/ui.jsx";
import { ROLE_LABELS } from "../lib/constants.js";

const ACTION_COLORS = {
  LOGIN: "bg-sky-100 text-sky-700", REGISTER: "bg-indigo-100 text-indigo-700",
  CREATE: "bg-brand-100 text-brand-700", UPDATE: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700", UPLOAD: "bg-violet-100 text-violet-700",
  PROGRESS: "bg-emerald-100 text-emerald-700", STATUS: "bg-cyan-100 text-cyan-700",
  ENTREE: "bg-brand-100 text-brand-700", SORTIE: "bg-amber-100 text-amber-700",
  SIGN: "bg-teal-100 text-teal-700", PHOTO: "bg-pink-100 text-pink-700",
};

export default function Activity() {
  const [logs, setLogs] = useState(null);
  const [entity, setEntity] = useState("");

  useEffect(() => {
    const params = entity ? { entity } : {};
    api.get("/activity", { params }).then((r) => setLogs(r.data)).catch(() => setLogs([]));
  }, [entity]);

  const entities = [...new Set((logs || []).map((l) => l.entity).filter(Boolean))];

  return (
    <div>
      <PageHeader title="Journal d'activité" subtitle="Traçabilité complète des actions (audit)" icon={ScrollText} />

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setEntity("")} className={`badge ${!entity ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"}`}><Filter size={11} /> Tout</button>
        {entities.map((e) => (
          <button key={e} onClick={() => setEntity(e)} className={`badge ${entity === e ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"}`}>{e}</button>
        ))}
      </div>

      {!logs ? <Spinner /> : logs.length === 0 ? (
        <Card><EmptyState icon={ScrollText} title="Aucune activité" /></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-brand-50">
            {logs.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4 hover:bg-white/40 transition">
                <Avatar name={`${l.user?.firstName || "?"} ${l.user?.lastName || ""}`} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-brand-900">
                    <span className="font-semibold">{l.user?.firstName} {l.user?.lastName}</span>
                    <span className="text-brand-700/60"> · {ROLE_LABELS[l.user?.role]}</span>
                  </p>
                  <p className="text-xs text-brand-700/60">{new Date(l.createdAt).toLocaleString("fr-FR")}{l.details ? ` · ${l.details}` : ""}{l.ip ? ` · ${l.ip}` : ""}</p>
                </div>
                <Badge className={ACTION_COLORS[l.action] || "bg-gray-100 text-gray-600"}>{l.action}</Badge>
                {l.entity && <Badge className="bg-brand-50 text-brand-700">{l.entity}</Badge>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
