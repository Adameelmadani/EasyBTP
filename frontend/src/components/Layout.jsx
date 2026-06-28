import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Building2, ClipboardList, AlertTriangle, FolderOpen, Camera,
  CalendarRange, Users2, Wallet, Package, Truck, ShoppingCart, Boxes, Warehouse,
  ScrollText, Bell, LogOut, Menu, X, ChevronDown, HardHat,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";
import { Avatar } from "./ui.jsx";
import { ROLE_LABELS } from "../lib/constants.js";

const NAV = [
  { section: "Pilotage", items: [
    { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, end: true },
    { to: "/projects", label: "Projets", icon: Building2 },
    { to: "/planning", label: "Planning", icon: CalendarRange },
  ]},
  { section: "Suivi chantier", items: [
    { to: "/progress", label: "Avancement", icon: ClipboardList },
    { to: "/reserves", label: "Réserves & NC", icon: AlertTriangle },
    { to: "/photos", label: "Photos & géoloc", icon: Camera },
    { to: "/documents", label: "Documents", icon: FolderOpen },
    { to: "/meetings", label: "Réunions", icon: Users2 },
  ]},
  { section: "Approvisionnement", items: [
    { to: "/materials", label: "Matériaux", icon: Package },
    { to: "/stock", label: "Stock & mouvements", icon: Boxes },
    { to: "/supply", label: "Demandes d'appro", icon: Warehouse },
    { to: "/orders", label: "Bons de commande", icon: ShoppingCart },
    { to: "/suppliers", label: "Fournisseurs", icon: Truck },
  ]},
  { section: "Gestion", items: [
    { to: "/finance", label: "Finance", icon: Wallet },
    { to: "/users", label: "Utilisateurs", icon: Users2 },
    { to: "/activity", label: "Journal d'activité", icon: ScrollText },
  ]},
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifs = () => api.get("/notifications").then((r) => setNotifications(r.data)).catch(() => {});
  useEffect(() => {
    loadNotifs();
    const t = setInterval(loadNotifs, 30000);
    return () => clearInterval(t);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const markAll = async () => {
    await api.patch("/notifications/read-all");
    loadNotifs();
  };

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Décor d'arrière-plan (style landing) */}
      <div className="fixed inset-0 -z-10 grid-overlay grid-overlay-fade opacity-50 pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full m-3 mr-0 lg:mr-3 glass-strong flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-brand-100/60">
            <div className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-green">
              <HardHat size={24} />
            </div>
            <div>
              <p className="font-display font-extrabold text-lg leading-none">
                <span className="text-brand-900">Via</span><span className="text-gradient-accent">BTP</span>
              </p>
              <p className="font-mono text-[10px] text-brand-700/60 mt-1 tracking-wider">[ suivi de chantier ]</p>
            </div>
            <button className="ml-auto lg:hidden text-brand-600" onClick={() => setMobileOpen(false)}>
              <X size={22} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {NAV.map((group) => (
              <div key={group.section}>
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-600/50">
                  {group.section}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
                    >
                      <item.icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-brand-100/60 text-center">
            <p className="text-[10px] text-brand-700/40">ViaBTP © 2026 · v1.0</p>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-brand-900/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 px-3 lg:px-6 py-3">
          <div className="glass flex items-center gap-3 px-4 py-2.5">
            <button className="lg:hidden text-brand-700" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-brand-900">Bonjour, {user?.firstName}</p>
              <p className="text-xs text-brand-700/60">Pilotez vos chantiers en temps réel</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen((o) => !o); setUserMenu(false); }}
                  className="relative grid place-items-center w-10 h-10 rounded-xl bg-white/50 border border-white/60 text-brand-700 hover:bg-white/80 transition"
                >
                  <Bell size={19} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 grid place-items-center min-w-5 h-5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 glass-strong overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-100/60">
                      <p className="font-bold text-brand-900">Notifications</p>
                      {unread > 0 && (
                        <button onClick={markAll} className="text-xs font-semibold text-brand-600 hover:underline">
                          Tout marquer lu
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-center text-sm text-brand-700/50">Aucune notification</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`px-4 py-3 border-b border-brand-50 ${!n.read ? "bg-brand-50/50" : ""}`}>
                            <p className="text-sm font-semibold text-brand-900">{n.title}</p>
                            <p className="text-xs text-brand-700/70 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => { setUserMenu((o) => !o); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-white/50 border border-white/60 hover:bg-white/80 transition"
                >
                  <Avatar name={`${user?.firstName} ${user?.lastName}`} size={32} />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-brand-900 leading-tight">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-brand-700/60">{ROLE_LABELS[user?.role]}</p>
                  </div>
                  <ChevronDown size={15} className="text-brand-600" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-52 glass-strong overflow-hidden animate-fade-in py-1.5">
                    <div className="px-4 py-2 border-b border-brand-100/60">
                      <p className="text-sm font-bold text-brand-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-brand-700/60 truncate">{user?.email}</p>
                    </div>
                    <button onClick={doLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-3 lg:px-6 pb-8 pt-1 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
