import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HardHat, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ROLE_LABELS } from "../lib/constants.js";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "VISITEUR", company: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast("Compte créé avec succès");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.message || "Échec de l'inscription", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <HardHat size={26} />
          </div>
          <span className="font-display text-2xl font-extrabold text-brand-900">EasyBTP</span>
        </div>

        <div className="glass-strong p-8">
          <h2 className="text-2xl font-bold text-brand-900">Créer un compte</h2>
          <p className="font-display text-sm text-brand-700/60 mt-1 mb-6">Rejoignez la plateforme de suivi de chantier.</p>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom</label>
                <input className="input" value={form.firstName} onChange={set("firstName")} required />
              </div>
              <div>
                <label className="label">Nom</label>
                <input className="input" value={form.lastName} onChange={set("lastName")} required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Mot de passe</label>
                <input className="input" type="password" value={form.password} onChange={set("password")} required minLength={6} />
              </div>
              <div>
                <label className="label">Rôle</label>
                <select className="select" value={form.role} onChange={set("role")}>
                  {Object.entries(ROLE_LABELS).filter(([k]) => k !== "ADMIN").map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Société</label>
                <input className="input" value={form.company} onChange={set("company")} />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input className="input" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Créer mon compte <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-brand-700/70 mt-6">
            Déjà inscrit ?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
