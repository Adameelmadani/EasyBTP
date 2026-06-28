import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import api from "../api/client.js";
import { Modal, Field, Input, Textarea, Select } from "./ui.jsx";
import { PROJECT_STATUS, enumToOptions } from "../lib/constants.js";
import { useToast } from "../context/ToastContext.jsx";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

// Formulaire partagé : création ET édition d'un projet.
export default function ProjectFormModal({ open, onClose, project, onSaved }) {
  const { toast } = useToast();
  const editing = !!project;
  const [form, setForm] = useState({ status: "PLANIFIE" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      project
        ? {
            name: project.name || "",
            reference: project.reference || "",
            clientName: project.clientName || "",
            address: project.address || "",
            latitude: project.latitude ?? "",
            longitude: project.longitude ?? "",
            surface: project.surface ?? "",
            budget: project.budget ?? "",
            marketAmount: project.marketAmount ?? "",
            status: project.status || "PLANIFIE",
            startDate: toDateInput(project.startDate),
            expectedEndDate: toDateInput(project.expectedEndDate),
            description: project.description || "",
          }
        : { status: "PLANIFIE" }
    );
  }, [project, open]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    // Les champs vides -> undefined (omis), pour ne pas écraser avec 0/null par erreur
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : v])
    );
    setSaving(true);
    try {
      if (editing) await api.put(`/projects/${project.id}`, payload);
      else await api.post("/projects", payload);
      onSaved();
    } catch (err) {
      toast(err.response?.data?.message || "Une erreur est survenue", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Modifier le projet" : "Nouveau projet"} size="lg">
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
          <button type="submit" className="btn-primary" disabled={saving}>
            {editing ? <><Save size={18} /> Enregistrer</> : <><Plus size={18} /> Créer le projet</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}
