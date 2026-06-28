import { useEffect, useState } from "react";
import { Users2, Plus, Pencil, Trash2, Mail, Phone, Shield, CheckCircle2, XCircle } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, Card, Spinner, Modal, Field, Input, Select, EmptyState, Badge, Avatar } from "../components/ui.jsx";
import { ROLE_LABELS } from "../lib/constants.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function UsersPage() {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [users, setUsers] = useState(null);
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const isAdmin = hasRole("ADMIN");

  const load = () => api.get("/users").then((r) => setUsers(r.data)).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);
  const remove = async (u) => { if (!confirm("Supprimer cet utilisateur ?")) return; await api.delete(`/users/${u.id}`); load(); toast("Supprimé"); };

  return (
    <div>
      <PageHeader
        title="Utilisateurs & rôles" subtitle="Gestion des comptes et permissions" icon={Users2}
        actions={isAdmin && <button className="btn-primary" onClick={() => { setEdit(null); setOpen(true); }}><Plus size={18} /> Nouvel utilisateur</button>}
      />

      {!users ? <Spinner /> : users.length === 0 ? (
        <Card><EmptyState icon={Users2} title="Aucun utilisateur" /></Card>
      ) : (
        <Card className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-brand-700/60 border-b border-brand-100/60">
              <th className="p-4">Utilisateur</th><th className="p-4">Rôle</th><th className="p-4">Contact</th><th className="p-4">Société</th><th className="p-4">Statut</th>{isAdmin && <th className="p-4"></th>}
            </tr></thead>
            <tbody className="divide-y divide-brand-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${u.firstName} ${u.lastName}`} size={38} />
                      <div><p className="font-semibold text-brand-900">{u.firstName} {u.lastName}</p><p className="text-xs text-brand-700/60">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="p-4"><Badge className="bg-brand-50 text-brand-700"><Shield size={11} /> {ROLE_LABELS[u.role]}</Badge></td>
                  <td className="p-4 text-brand-700/70">{u.phone || "-"}</td>
                  <td className="p-4 text-brand-700/70">{u.company || "-"}</td>
                  <td className="p-4">{u.isActive ? <Badge className="bg-brand-100 text-brand-700"><CheckCircle2 size={11} /> Actif</Badge> : <Badge className="bg-red-100 text-red-700"><XCircle size={11} /> Inactif</Badge>}</td>
                  {isAdmin && <td className="p-4"><div className="flex gap-1.5"><button className="btn-ghost btn-sm" onClick={() => { setEdit(u); setOpen(true); }}><Pencil size={13} /></button><button className="btn-danger btn-sm" onClick={() => remove(u)}><Trash2 size={13} /></button></div></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <UserModal open={open} onClose={() => setOpen(false)} user={edit} onSaved={() => { setOpen(false); load(); toast(edit ? "Modifié" : "Créé"); }} />
    </div>
  );
}

function UserModal({ open, onClose, user, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ role: "VISITEUR", isActive: true });
  useEffect(() => { setForm(user ? { ...user } : { role: "VISITEUR", isActive: true }); }, [user, open]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      if (user) await api.put(`/users/${user.id}`, form);
      else await api.post("/users", form);
      onSaved();
    } catch (err) { toast(err.response?.data?.message || "Erreur", "error"); }
  };
  return (
    <Modal open={open} onClose={onClose} title={user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom *"><Input value={form.firstName || ""} onChange={set("firstName")} required /></Field>
          <Field label="Nom *"><Input value={form.lastName || ""} onChange={set("lastName")} required /></Field>
        </div>
        <Field label="Email *"><Input type="email" value={form.email || ""} onChange={set("email")} required /></Field>
        {!user && <Field label="Mot de passe"><Input type="password" value={form.password || ""} onChange={set("password")} placeholder="password123 par défaut" /></Field>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rôle"><Select value={form.role} onChange={set("role")}>{Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
          <Field label="Téléphone"><Input value={form.phone || ""} onChange={set("phone")} /></Field>
        </div>
        <Field label="Société"><Input value={form.company || ""} onChange={set("company")} /></Field>
        {user && (
          <label className="flex items-center gap-2 text-sm text-brand-800"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-brand-600" /> Compte actif</label>
        )}
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Annuler</button><button className="btn-primary"><Plus size={16} /> {user ? "Enregistrer" : "Créer"}</button></div>
      </form>
    </Modal>
  );
}
