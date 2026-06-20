import { useEffect, useState } from "react";
import { Users2, Plus, Calendar, MapPin, CheckSquare, Square, ListChecks } from "lucide-react";
import api from "../api/client.js";
import { PageHeader, Card, Spinner, Modal, Field, Input, Textarea, EmptyState, Badge, Avatar } from "../components/ui.jsx";
import ProjectPicker from "../components/ProjectPicker.jsx";
import { useProjects } from "../lib/hooks.js";
import { TASK_STATUS, ROLE_LABELS } from "../lib/constants.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Meetings() {
  const { toast } = useToast();
  const { projects, projectId, setProjectId } = useProjects();
  const [meetings, setMeetings] = useState(null);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const load = () => api.get("/meetings", { params: { projectId } }).then((r) => setMeetings(r.data)).catch(() => setMeetings([]));
  useEffect(() => { if (projectId) load(); }, [projectId]);
  useEffect(() => { api.get("/users").then((r) => setUsers(r.data)); }, []);

  const toggleAttendance = async (meeting, att) => {
    await api.patch(`/meetings/${meeting.id}/attendance`, { attendeeId: att.id, present: !att.present });
    const r = await api.get(`/meetings/${meeting.id}`); setDetail(r.data); load();
  };

  return (
    <div>
      <PageHeader
        title="Réunions de chantier" subtitle="Comptes rendus, présences & actions à suivre" icon={Users2}
        actions={<div className="flex gap-2 flex-wrap">
          <ProjectPicker projects={projects} value={projectId} onChange={setProjectId} />
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} /> Planifier</button>
        </div>}
      />

      {!meetings ? <Spinner /> : meetings.length === 0 ? (
        <Card><EmptyState icon={Users2} title="Aucune réunion" /></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {meetings.map((m) => (
            <Card key={m.id} hover className="cursor-pointer" onClick={async () => { const r = await api.get(`/meetings/${m.id}`); setDetail(r.data); }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-brand-900">{m.title}</h3>
                <Badge className="bg-brand-50 text-brand-700">{m.actions?.length || 0} actions</Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-brand-700/70 mb-3">
                <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(m.date).toLocaleDateString("fr-FR", { dateStyle: "long" })}</span>
                {m.location && <span className="flex items-center gap-1"><MapPin size={13} /> {m.location}</span>}
              </div>
              <div className="flex -space-x-2">
                {m.attendees?.slice(0, 6).map((a) => <Avatar key={a.id} name={`${a.user.firstName} ${a.user.lastName}`} size={28} />)}
                {m.attendees?.length > 6 && <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">+{m.attendees.length - 6}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <MeetingModal open={open} onClose={() => setOpen(false)} projectId={projectId} users={users} onSaved={() => { setOpen(false); load(); toast("Réunion planifiée"); }} />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title || ""} size="lg">
        {detail && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3 text-sm text-brand-700/70">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(detail.date).toLocaleDateString("fr-FR", { dateStyle: "full" })}</span>
              {detail.location && <span className="flex items-center gap-1"><MapPin size={14} /> {detail.location}</span>}
            </div>
            {detail.agenda && <div><p className="label">Ordre du jour</p><p className="text-sm text-brand-800/80 whitespace-pre-line bg-white/50 rounded-xl p-3 border border-white/60">{detail.agenda}</p></div>}
            {detail.minutes && <div><p className="label">Compte rendu</p><p className="text-sm text-brand-800/80 bg-white/50 rounded-xl p-3 border border-white/60">{detail.minutes}</p></div>}

            <div>
              <p className="label">Liste de présence</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {detail.attendees.map((a) => (
                  <button key={a.id} onClick={() => toggleAttendance(detail, a)} className="flex items-center gap-2 p-2 rounded-xl bg-white/50 border border-white/60 hover:bg-white/80 transition text-left">
                    {a.present ? <CheckSquare size={18} className="text-brand-600" /> : <Square size={18} className="text-brand-300" />}
                    <Avatar name={`${a.user.firstName} ${a.user.lastName}`} size={28} />
                    <div className="min-w-0"><p className="text-sm font-medium text-brand-900 truncate">{a.user.firstName} {a.user.lastName}</p><p className="text-[10px] text-brand-700/60">{ROLE_LABELS[a.user.role]}</p></div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="label flex items-center gap-1"><ListChecks size={14} /> Actions à suivre</p>
              <div className="space-y-2">
                {detail.actions.length === 0 ? <p className="text-sm text-brand-700/50">Aucune action.</p> : detail.actions.map((ac) => (
                  <div key={ac.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/60">
                    <div><p className="text-sm font-medium text-brand-900">{ac.description}</p>{ac.assignedTo && <p className="text-xs text-brand-700/60">→ {ac.assignedTo.firstName} {ac.assignedTo.lastName}{ac.dueDate ? ` · ${new Date(ac.dueDate).toLocaleDateString("fr-FR")}` : ""}</p>}</div>
                    <Badge className={TASK_STATUS[ac.status].color}>{TASK_STATUS[ac.status].label}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function MeetingModal({ open, onClose, projectId, users, onSaved }) {
  const [form, setForm] = useState({});
  const [attendeeIds, setAttendeeIds] = useState([]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (id) => setAttendeeIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/meetings", { ...form, projectId, attendeeIds });
    setForm({}); setAttendeeIds([]); onSaved();
  };
  return (
    <Modal open={open} onClose={onClose} title="Planifier une réunion" size="lg">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Titre *"><Input value={form.title || ""} onChange={set("title")} required /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date *"><Input type="datetime-local" value={form.date || ""} onChange={set("date")} required /></Field>
          <Field label="Lieu"><Input value={form.location || ""} onChange={set("location")} /></Field>
        </div>
        <Field label="Ordre du jour"><Textarea value={form.agenda || ""} onChange={set("agenda")} /></Field>
        <Field label="Compte rendu (optionnel)"><Textarea value={form.minutes || ""} onChange={set("minutes")} /></Field>
        <Field label="Participants">
          <div className="grid sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto p-1">
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-50 cursor-pointer text-sm">
                <input type="checkbox" checked={attendeeIds.includes(u.id)} onChange={() => toggle(u.id)} className="accent-brand-600" />
                {u.firstName} {u.lastName}
              </label>
            ))}
          </div>
        </Field>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Annuler</button><button className="btn-primary"><Plus size={16} /> Planifier</button></div>
      </form>
    </Modal>
  );
}
