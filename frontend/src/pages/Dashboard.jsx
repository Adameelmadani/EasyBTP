import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Building2, TrendingUp, AlertTriangle, Package, Wallet,
  Clock, Camera, Activity as ActivityIcon, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import api from "../api/client.js";
import { Card, StatCard, PageHeader, Spinner, ProgressBar, Badge } from "../components/ui.jsx";
import { PROJECT_STATUS, fmtMAD, fmtMADc, fmtNum } from "../lib/constants.js";

// Palette dérivée des deux couleurs de marque : nuances de vert -> orange
const STATUS_COLORS = { PLANIFIE: "#5fe09a", EN_COURS: "#16b563", TERMINE: "#0a7543", EN_PAUSE: "#ff8a4c", ANNULE: "#f15206" };

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <Spinner />;
  const { kpis } = data;

  // avancement réel par projet
  const progressByProject = data.projects.map((p) => ({ name: (p.reference || p.name || "").slice(-6), full: p.name, avancement: Math.round(p.progress) }));
  const pieData = data.projectsByStatus.map((s) => ({ name: PROJECT_STATUS[s.status]?.label || s.status, value: s.count, key: s.status }));
  const budgetData = data.projects.map((p) => ({ name: p.reference.slice(-3), marché: (p.marketAmount || 0) / 1e6 }));

  return (
    <div className="space-y-5">
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de vos chantiers" icon={LayoutDashboard} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projets actifs" value={<span className="font-display">{kpis.activeProjects}</span>} sub={`${kpis.totalProjects} au total`} icon={Building2} tint="brand" />
        <StatCard label="Avancement moyen" value={<span className="font-display">{kpis.avgProgress}%</span>} sub="tous chantiers" icon={TrendingUp} tint="accent" />
        <StatCard label="Réserves ouvertes" value={<span className="font-display">{kpis.reservesOpen}</span>} sub={`${kpis.reservesTotal} au total`} icon={AlertTriangle} tint="accent" />
        <StatCard label="Stocks bas" value={<span className="font-display">{kpis.lowStockCount}</span>} sub="à réapprovisionner" icon={Package} tint="accent" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Montant marchés" value={<span className="font-display">{fmtMADc(kpis.totalMarket)}</span>} icon={Wallet} tint="brand" />
        <StatCard label="Facturé (validé)" value={<span className="font-display">{fmtMADc(kpis.billed)}</span>} icon={Wallet} tint="brand" />
        <StatCard label="Valeur du stock" value={<span className="font-display">{fmtMADc(kpis.stockValue)}</span>} icon={Package} tint="brand" />
        <StatCard label="Tâches en retard" value={<span className="font-display">{data.lateTasks.length}</span>} icon={Clock} tint="accent" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">Avancement par projet</h3>
            <Badge className="bg-brand-100 text-brand-700"><TrendingUp size={13} /> {kpis.avgProgress}% moyen</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={progressByProject}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3fd07f" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0a7543" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6f9e2" vertical={false} />
              <XAxis dataKey="name" stroke="#0a7543" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#0a7543" fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
              <Tooltip cursor={{ fill: "rgba(22,181,99,0.06)" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #aff2c8", background: "rgba(255,255,255,0.95)" }}
                formatter={(v) => [`${v}%`, "Avancement"]}
                labelFormatter={(l, p) => p?.[0]?.payload?.full || l} />
              <Bar dataKey="avancement" fill="url(#g1)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-brand-900 mb-4">Statut des projets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {pieData.map((e) => <Cell key={e.key} fill={STATUS_COLORS[e.key] || "#16b563"} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #aff2c8" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((e) => (
              <div key={e.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-brand-800">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[e.key] }} />
                  {e.name}
                </span>
                <span className="font-semibold text-brand-900">{e.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects + activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">Projets en cours</h3>
            <Link to="/projects" className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1">
              Tout voir <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.projects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="block p-3.5 rounded-2xl bg-white/50 hover:bg-white/80 border border-white/60 transition group">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-900 truncate group-hover:text-brand-700">{p.name}</p>
                    <p className="text-xs text-brand-700/60">{p.reference}</p>
                  </div>
                  <Badge className={PROJECT_STATUS[p.status]?.color}>{PROJECT_STATUS[p.status]?.label}</Badge>
                </div>
                <ProgressBar value={p.progress} showLabel />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2"><ActivityIcon size={18} /> Activité récente</h3>
          <div className="space-y-3">
            {data.recentActivity.length === 0 && <p className="text-sm text-brand-700/50">Aucune activité.</p>}
            {data.recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-brand-900">
                    <span className="font-semibold">{a.user?.firstName} {a.user?.lastName}</span>{" "}
                    <span className="text-brand-700/70">· {a.action} {a.entity}</span>
                  </p>
                  <p className="text-xs text-brand-700/50">{new Date(a.createdAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Budget + photos */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-brand-900 mb-4">Montant des marchés (M MAD)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6f9e2" vertical={false} />
              <XAxis dataKey="name" stroke="#0a7543" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#0a7543" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #aff2c8" }} formatter={(v) => `${v} M MAD`} />
              <Bar dataKey="marché" fill="#16b563" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2"><Camera size={18} /> Photos récentes</h3>
          <div className="grid grid-cols-3 gap-2">
            {data.recentPhotos.map((ph) => (
              <div key={ph.id} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={ph.url} alt={ph.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-1.5">
                  <p className="text-[10px] text-white font-medium truncate">{ph.zone}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
