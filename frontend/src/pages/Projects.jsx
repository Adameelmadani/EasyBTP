import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Search, MapPin, Calendar, Users2, AlertTriangle, FolderOpen, Camera } from "lucide-react";
import api from "../api/client.js";
import { Card, PageHeader, Spinner, Badge, ProgressBar, Modal, Field, Input, Textarea, Select, EmptyState } from "../components/ui.jsx";
import { PROJECT_STATUS, fmtMAD, enumToOptions } from "../lib/constants.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Projects() {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [projects, setProjects] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const load = () => {
    const params = {};
    if (q) params.q = q;
    if (status) params.status = status;
    api.get("/projects", { params }).then((r) => setProjects(r.data)).catch(() => setProjects([]));
  };
  useEffect(() => { load(); }, [q, status]);

  const canCreate = hasRole("MAITRE_OUVRAGE", "ARCHITECTE", "BUREAU_ETUDES", "CONDUCTEUR_TRAVAUX", "ENTREPRISE");

  return (
    <div>
      <PageHeader
        title="Projets" subtitle="Vos chantiers de construction" icon={Building2}
        actions={canCreate && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} /> Nouveau projet</button>}
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
          <input className="input pl-10" placeholder="Rechercher un projet..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="select max-w-[200px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {!projects ? <Spinner /> : projects.length === 0 ? (
        <Card><EmptyState icon={Building2} title="Aucun projet" subtitle="Créez votre premier chantier pour commencer le suivi." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-brand-900 truncate">{p.name}</h3>
                    <p className="text-xs text-brand-700/60">{p.reference}</p>
                  </div>
                  <Badge className={PROJECT_STATUS[p.status]?.color}>{PROJECT_STATUS[p.status]?.label}</Badge>
                </div>
                {p.address && (
                  <p className="flex items-center gap-1.5 text-xs text-brand-700/70 mb-1"><MapPin size={13} /> {p.address}</p>
                )}
                {p.expectedEndDate && (
                  <p className="flex items-center gap-1.5 text-xs text-brand-700/70 mb-3">
                    <Calendar size={13} /> Livraison {new Date(p.expectedEndDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-brand-700/70 mb-1">
                    <span>Avancement</span><span className="font-semibold text-brand-800">{Math.round(p.progress)}%</span>
                  </div>
                  <ProgressBar value={p.progress} />
                </div>
                <p className="text-sm font-bold text-brand-900 mb-3">{fmtMAD(p.marketAmount)}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-brand-700/60 pt-3 border-t border-brand-100/60">
                  <span className="flex items-center gap-1"><Users2 size={13} /> {p.members?.length || 0}</span>
                  <span className="flex items-center gap-1"><AlertTriangle size={13} /> {p._count?.reserves || 0}</span>
                  <span className="flex items-center gap-1"><FolderOpen size={13} /> {p._count?.documents || 0}</span>
                  <span className="flex items-center gap-1"><Camera size={13} /> {p._count?.photos || 0}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal open={open} onClose={() => setOpen(false)} onCreated={() => { setOpen(false); load(); toast("Projet créé"); }} />
    </div>
  );
}

function CreateProjectModal({ open, onClose, onCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ status: "PLANIFIE" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", form);
      onCreated();
      setForm({ status: "PLANIFIE" });
    } catch (err) {
      toast(err.response?.data?.message || "Erreur", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau projet" size="lg">
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom du projet *" className="sm:col-span-2"><Input value={form.name || ""} onChange={set("name")} required /></Field>
        <Field label="Référence *"><Input value={form.reference || ""} onChange={set("reference")} placeholder="PRJ-2026-00X" required /></Field>
        <Field label="Maître d'ouvrage / Client"><Input value={form.clientName || ""} onChange={set("clientName")} /></Field>
        <Field label="Adresse" className="sm:col-span-2"><Input value={form.address || ""} onChange={set("address")} /></Field>
        <Field label="Latitude GPS"><Input type="number" step="any" value={form.latitude || ""} onChange={set("latitude")} /></Field>
        <Field label="Longitude GPS"><Input type="number" step="any" value={form.longitude || ""} onChange={set("longitude")} /></Field>
        <Field label="Surface (m²)"><Input type="number" value={form.surface || ""} onChange={set("surface")} /></Field>
        <Field label="Budget (MAD)"><Input type="number" value={form.budget || ""} onChange={set("budget")} /></Field>
        <Field label="Montant du marché (MAD)"><Input type="number" value={form.marketAmount || ""} onChange={set("marketAmount")} /></Field>
        <Field label="Statut">
          <Select value={form.status} onChange={set("status")}>
            {enumToOptions(PROJECT_STATUS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Date de début"><Input type="date" value={form.startDate || ""} onChange={set("startDate")} /></Field>
        <Field label="Date prévisionnelle de fin"><Input type="date" value={form.expectedEndDate || ""} onChange={set("expectedEndDate")} /></Field>
        <Field label="Description" className="sm:col-span-2"><Textarea value={form.description || ""} onChange={set("description")} /></Field>
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
          <button type="submit" className="btn-primary"><Plus size={18} /> Créer le projet</button>
        </div>
      </form>
    </Modal>
  );
}
