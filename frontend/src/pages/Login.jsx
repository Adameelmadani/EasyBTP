import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HardHat, Mail, Lock, ArrowRight, Loader2, Building2, ShieldCheck, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const DEMO = [
  { label: "Administrateur", email: "admin@easybtp.ma" },
  { label: "Conducteur de travaux", email: "conducteur@easybtp.ma" },
  { label: "Chef de chantier", email: "chef@easybtp.ma" },
];

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@easybtp.ma");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast("Connexion réussie");
      navigate("/");
    } catch (err) {
      toast(err.response?.data?.message || "Échec de la connexion", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Hero gauche */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur">
            <HardHat size={26} />
          </div>
          <span className="text-2xl font-extrabold">EasyBTP</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight">
            Pilotez vos chantiers <br /> en temps réel.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            La plateforme centralisée de suivi de chantier : avancement, réserves, documents,
            planning, approvisionnement et finance — au même endroit.
          </p>
          <div className="mt-8 space-y-3 max-w-sm">
            {[
              { icon: BarChart3, t: "Avancement physique & financier en direct" },
              { icon: ShieldCheck, t: "Réserves, non-conformités & qualité" },
              { icon: Building2, t: "Gestion multi-projets & intervenants" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3 border border-white/15">
                <f.icon size={20} />
                <span className="text-sm font-medium">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/50">© 2026 EasyBTP · Cahier des Prescriptions Techniques</p>
      </div>

      {/* Formulaire droite */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
              <HardHat size={26} />
            </div>
            <span className="text-2xl font-extrabold text-brand-900">EasyBTP</span>
          </div>

          <div className="glass-strong p-8">
            <h2 className="text-2xl font-bold text-brand-900">Connexion</h2>
            <p className="text-sm text-brand-700/60 mt-1 mb-6">Accédez à votre espace de pilotage.</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="label">Adresse email</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input className="input pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@easybtp.ma" />
                </div>
              </div>
              <div>
                <label className="label">Mot de passe</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input className="input pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Se connecter <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/50 mb-2">Comptes de démonstration</p>
              <div className="grid gap-1.5">
                {DEMO.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => { setEmail(d.email); setPassword("password123"); }}
                    className="flex items-center justify-between text-left px-3 py-2 rounded-xl bg-brand-50/70 hover:bg-brand-100 transition text-sm"
                  >
                    <span className="font-medium text-brand-800">{d.label}</span>
                    <span className="text-xs text-brand-600">{d.email}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-brand-700/50 mt-2">Mot de passe : <code className="font-mono">password123</code></p>
            </div>

            <p className="text-center text-sm text-brand-700/70 mt-6">
              Pas encore de compte ?{" "}
              <Link to="/register" className="font-semibold text-brand-600 hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
