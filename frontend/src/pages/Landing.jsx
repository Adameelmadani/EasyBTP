import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HardHat, ArrowRight, ArrowUpRight, Warning, Dashboard, ClipboardList,
  Camera, Plan, Calendar, Coins, Bricks, Pallet, Users, Shield,
  Activity, Cpu, Cube, Chart, Sparkles, MapPin, Bell,
} from "../components/icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

/* Révélation au défilement */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FLOAT_TAGS = [
  { t: "[ avancement ]", x: "4%", y: "10%", d: "0s" },
  { t: "[ réserves ]", x: "70%", y: "2%", d: "0.6s" },
  { t: "[ stock ]", x: "82%", y: "44%", d: "1.1s" },
  { t: "[ finance ]", x: "0%", y: "62%", d: "0.3s" },
  { t: "[ planning ]", x: "60%", y: "82%", d: "0.9s" },
  { t: "[ BIM ]", x: "30%", y: "92%", d: "1.4s" },
];

const STATS = [
  { v: "11", l: "modules métier" },
  { v: "9", l: "rôles & permissions" },
  { v: "MAD", l: "devise & contexte local" },
  { v: "<3s", l: "temps de réponse" },
];

const PROBLEMS = [
  { t: "Suivi dispersé", d: "Excel, WhatsApp, papier : l'information est éclatée, personne n'a la même version.", tone: "accent" },
  { t: "Aucune visibilité", d: "Les retards et dépassements de budget se découvrent trop tard, sans données fiables.", tone: "green" },
  { t: "Réserves perdues", d: "Non-conformités non tracées, levées non validées, responsabilités floues.", tone: "green" },
  { t: "Coûts qui dérapent", d: "Approvisionnement non maîtrisé : ruptures de stock, gaspillage, marges grignotées.", tone: "accent" },
];

const STEPS = [
  { n: "01", t: "Tout au même endroit", d: "Projets, lots, documents, photos, réunions, finance et matériaux dans un espace unique et structuré." },
  { n: "02", t: "Analytique & alertes", d: "Tableaux de bord en temps réel : taux d'avancement, retards, réserves ouvertes, situation financière." },
  { n: "03", t: "Pensé pour le terrain", d: "Saisie mobile, photos horodatées et géolocalisées, mode hors-ligne et synchronisation automatique." },
  { n: "04", t: "Approvisionnement maîtrisé", d: "Stock, fournisseurs, demandes et bons de commande, alertes de seuil et valorisation." },
];

const MODULES = [
  { icon: Dashboard, t: "Tableau de bord", d: "KPIs, graphiques & alertes" },
  { icon: ClipboardList, t: "Avancement", d: "Suivi par lot & validation" },
  { icon: Warning, t: "Réserves & NC", d: "Kanban, statuts, levées" },
  { icon: Camera, t: "Photos & géoloc", d: "Horodatées, par zone" },
  { icon: Plan, t: "Documents", d: "GED, versions, signatures" },
  { icon: Calendar, t: "Planning", d: "Gantt & dépendances" },
  { icon: Coins, t: "Finance", d: "Situations & décomptes" },
  { icon: Bricks, t: "Matériaux", d: "Catalogue & fiches" },
  { icon: Pallet, t: "Stock", d: "Mouvements & valorisation" },
  { icon: Users, t: "Utilisateurs", d: "9 rôles & permissions" },
  { icon: Shield, t: "Sécurité", d: "JWT, RBAC, journal" },
  { icon: Activity, t: "Journal d'activité", d: "Traçabilité complète" },
];

function Gem() {
  return (
    <div className="scene-3d relative w-[320px] h-[320px] mx-auto">
      {/* halos */}
      <div className="absolute inset-0 rounded-full bg-accent-400/20 blur-3xl animate-glow-pulse" />
      <div className="absolute inset-8 rounded-full bg-brand-400/15 blur-2xl" />
      {/* cristal */}
      <div className="relative w-full h-full grid place-items-center animate-float-lg">
        <div className="gem w-[190px] h-[190px]">
          <div className="gem-pyr top">
            <span className="gem-facet" /><span className="gem-facet" /><span className="gem-facet" /><span className="gem-facet" />
          </div>
          <div className="gem-pyr bottom">
            <span className="gem-facet" /><span className="gem-facet" /><span className="gem-facet" /><span className="gem-facet" />
          </div>
        </div>
        {/* reticle de sélection (style outil de design) */}
        <div className="absolute w-[210px] h-[210px]">
          <div className="reticle">
            <span /><span /><span /><span />
          </div>
          <span className="absolute -top-7 left-0 mono-tag text-brand-700">via_btp</span>
        </div>
      </div>
      {/* SVG : trajectoire animée (façon carte de vol) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320" fill="none">
        <path d="M30 250 C 110 180, 210 230, 290 90" stroke="#ff6a1a" strokeWidth="1.5"
          strokeDasharray="6 8" strokeLinecap="round" opacity="0.75">
          <animate attributeName="stroke-dashoffset" from="140" to="0" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="30" cy="250" r="4" fill="#16b563" />
        <circle cx="290" cy="90" r="5" fill="#ff6a1a" />
      </svg>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  useReveal();
  const appLink = user ? "/dashboard" : "/login";
  const appLabel = user ? "Ouvrir le tableau de bord" : "Accéder à l'application";

  // Défilement doux et animé vers la section ciblée
  const scrollToId = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth text-brand-900">
      {/* ====== NAV ====== */}
      <header className="sticky top-0 z-40 px-4 lg:px-8 py-4">
        <nav className="glass max-w-7xl mx-auto flex items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5" title="Accueil ViaBTP">
            <Logo size={36} />
            <span className="font-display text-xl font-extrabold">Via<span className="text-gradient-accent">BTP</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4 text-sm">
            <a href="#problemes" onClick={(e) => scrollToId(e, "problemes")} className="px-3 py-2 rounded-lg text-brand-700/80 hover:text-brand-900 hover:bg-brand-50 transition">Enjeux</a>
            <a href="#solution" onClick={(e) => scrollToId(e, "solution")} className="px-3 py-2 rounded-lg text-brand-700/80 hover:text-brand-900 hover:bg-brand-50 transition">Solution</a>
            <a href="#modules" onClick={(e) => scrollToId(e, "modules")} className="px-3 py-2 rounded-lg text-brand-700/80 hover:text-brand-900 hover:bg-brand-50 transition">Modules</a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!user && (
              <Link to="/login" className="hidden sm:inline-flex btn-ghost btn-sm">Se connecter</Link>
            )}
            <Link to={appLink} className="btn-primary btn-sm">
              {appLabel} <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ====== HERO ====== */}
      <section className="relative px-4 lg:px-8 lg:pt-14 pb-20">
        <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-70" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          {/* texte */}
          <div className="animate-reveal">
            <h1 className="mt-6 font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] text-brand-900">
              Le pilotage de chantier,<br />
              <span className="text-gradient-accent">sans approximation.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-brand-700/80 max-w-xl">
              ViaBTP réunit avancement, réserves, documents, planning, approvisionnement et
              finance dans une seule plateforme. Analytique, terrain et décisions, au même endroit.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={appLink} className="btn-primary px-6 py-3 text-base">
                {appLabel} <ArrowRight size={18} />
              </Link>
              <a href="#modules" onClick={(e) => scrollToId(e, "modules")} className="btn-ghost px-6 py-3 text-base">
                Découvrir les modules
              </a>
            </div>
            {/* mini-stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {STATS.map((s) => (
                <div key={s.l} className="glass-sm px-4 py-3">
                  <p className="font-display text-2xl font-extrabold text-gradient-green">{s.v}</p>
                  <p className="text-[11px] text-brand-700/70 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* visuel 3D + tags flottants */}
          <div className="relative h-[420px] lg:h-[480px]">
            {FLOAT_TAGS.map((tag) => (
              <span
                key={tag.t}
                className="absolute mono-tag px-2.5 py-1 rounded-md border border-brand-100 bg-white/70 backdrop-blur shadow-glass-sm animate-float"
                style={{ left: tag.x, top: tag.y, animationDelay: tag.d }}
              >
                {tag.t}
              </span>
            ))}
            <div className="absolute inset-0 grid place-items-center">
              <Gem />
            </div>
          </div>
        </div>

        {/* marquee de modules */}
        <div className="relative mt-10 max-w-7xl mx-auto overflow-hidden border-y border-brand-100 py-4">
          <div className="marquee-track gap-10 text-brand-600/50 font-mono text-sm whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <span key={k} className="flex gap-10">
                {["Gros œuvre", "VRD", "Électricité", "Fluides", "Finitions", "Menuiserie", "Réserves", "Photos", "Planning", "Stock", "Fournisseurs", "Finance"].map((m) => (
                  <span key={m} className="flex items-center gap-10">
                    {m} <span className="text-accent-500">/</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROBLÈMES ====== */}
      <section id="problemes" className="relative px-4 lg:px-8 pb-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-on-scroll max-w-3xl">
            <p className="mono-tag">[ le constat ]</p>
            <h2 className="mt-3 font-display text-4xl lg:text-5xl font-extrabold text-brand-900">
              Vos chantiers avancent,<br /><span className="text-gradient-accent">mais pas vos données.</span>
            </h2>
            <p className="mt-4 text-brand-700/70">Les 4 problèmes que rencontrent la plupart des équipes de construction.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {PROBLEMS.map((p, i) => (
              <div key={p.t} className="reveal-on-scroll glass p-6 card-hover" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <div className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${p.tone === "accent" ? "bg-accent-500/12 text-accent-600" : "bg-brand-500/12 text-brand-700"}`}>
                    <Warning size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-900">{p.t}</h3>
                    <p className="mt-1.5 text-sm text-brand-700/70 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SOLUTION (01-04) ====== */}
      <section id="solution" className="relative px-4 lg:px-8 pb-20 scroll-mt-24">
        <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <div className="reveal-on-scroll max-w-3xl">
            <p className="mono-tag">[ notre approche ]</p>
            <h2 className="mt-3 font-display text-4xl lg:text-5xl font-extrabold text-brand-900">
              Une plateforme,<br /><span className="text-gradient-green">quatre certitudes.</span>
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="reveal-on-scroll glass p-6 card-hover relative overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-display text-6xl font-extrabold text-brand-900/[0.06] absolute -top-2 right-2 select-none">{s.n}</span>
                <p className="font-mono text-sm text-accent-600">{s.n}</p>
                <h3 className="mt-3 text-lg font-bold text-brand-900">{s.t}</h3>
                <p className="mt-2 text-sm text-brand-700/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MODULES ====== */}
      <section id="modules" className="relative px-4 lg:px-8 pb-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="reveal-on-scroll flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="mono-tag">[ couverture fonctionnelle ]</p>
              <h2 className="mt-3 font-display text-4xl lg:text-5xl font-extrabold text-brand-900">
                11 modules, <span className="text-gradient-accent">zéro angle mort.</span>
              </h2>
            </div>
            <Link to={appLink} className="btn-ghost">Explorer l'application <ArrowUpRight size={16} /></Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MODULES.map((m, i) => (
              <div key={m.t} className="reveal-on-scroll glass p-5 card-hover group" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <div className="icon-tile grid place-items-center w-11 h-11 rounded-xl ring-1 ring-brand-500/20 text-brand-600 group-hover:text-accent-600 group-hover:ring-accent-500/25 transition-all">
                  <m.icon size={20} />
                </div>
                <h3 className="mt-4 font-bold text-brand-900">{m.t}</h3>
                <p className="text-sm text-brand-700/60 mt-1">{m.d}</p>
              </div>
            ))}
          </div>
          {/* technologies avancées */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { icon: Cpu, t: "Intelligence artificielle", d: "Détection des retards, analyse des photos, prévision des besoins." },
              { icon: Cube, t: "BIM 3D", d: "Visualisation de maquette, réserves sur modèle, quantités automatiques." },
              { icon: Chart, t: "Reporting", d: "Export PDF & Excel, rapports automatiques, historique complet." },
            ].map((m, i) => (
              <div key={m.t} className="reveal-on-scroll glass p-6 card-hover flex items-start gap-4" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="icon-tile grid place-items-center w-11 h-11 rounded-xl ring-1 ring-accent-500/20 text-accent-600 shrink-0">
                  <m.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-900 flex items-center gap-2">{m.t} <span className="mono-tag text-brand-600">cible</span></h3>
                  <p className="text-sm text-brand-700/60 mt-1">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="relative px-4 lg:px-8 pb-20">
        <div className="reveal-on-scroll relative max-w-5xl mx-auto glass-strong overflow-hidden text-center p-12 lg:p-16">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-accent-400/15 blur-3xl animate-glow-pulse" />
          <div className="relative">
            <Sparkles className="mx-auto text-accent-500" size={28} />
            <h2 className="mt-4 font-display text-4xl lg:text-5xl font-extrabold text-brand-900">
              Prêt à piloter <span className="text-gradient-green">en temps réel</span> ?
            </h2>
            <p className="mt-4 text-brand-700/70 max-w-xl mx-auto">
              Connectez-vous avec un compte de démonstration et explorez les 11 modules de ViaBTP.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={appLink} className="btn-primary px-7 py-3.5 text-base">
                {appLabel} <ArrowRight size={18} />
              </Link>
              {!user && (
                <Link to="/register" className="btn-ghost px-7 py-3.5 text-base">Créer un compte</Link>
              )}
            </div>
            <p className="mt-6 font-mono text-xs text-brand-700/50">Le pilotage de chantier, sans approximation.</p>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="relative px-4 lg:px-8 py-10 border-t border-brand-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" title="Accueil ViaBTP">
            <Logo size={36} />
            <span className="font-display text-lg font-extrabold">Via<span className="text-gradient-accent">BTP</span></span>
          </Link>
          <p className="font-mono text-xs text-brand-700/50">© 2026 ViaBTP · Suivi de chantier de construction</p>
          <div className="flex items-center gap-4 text-brand-700/70 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-500" /> Maroc</span>
            <span className="flex items-center gap-1.5"><Bell size={14} className="text-accent-500" /> Temps réel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
