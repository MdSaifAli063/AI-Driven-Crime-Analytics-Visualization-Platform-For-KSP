import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, Network, TrendingUp, Brain, Users, BellRing, Settings,
  ChevronLeft, ChevronRight, Lock,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { anomalyAlerts } from "@/data/mockData";

const ITEMS = [
  { to: "/dashboard",             label: "Overview",         icon: LayoutDashboard },
  { to: "/dashboard/map",         label: "Hotspot Map",      icon: Map },
  { to: "/dashboard/network",     label: "Network Analysis", icon: Network, perm: "network_analysis" },
  { to: "/dashboard/trends",      label: "Trend Analytics",  icon: TrendingUp },
  { to: "/dashboard/predictions", label: "AI Predictions",   icon: Brain, perm: "ai_predictions" },
  { to: "/dashboard/offenders",   label: "Offender Profiles",icon: Users },
  { to: "/dashboard/alerts",      label: "Anomaly Alerts",   icon: BellRing, badgeKey: "alerts" },
  { to: "/dashboard/settings",    label: "Settings",         icon: Settings },
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { hasPermission } = useAuth();
  const unreadAlerts = anomalyAlerts.filter((a) => !a.resolved).length;

  return (
    <aside className={`relative hidden shrink-0 flex-col border-r border-soft bg-surface transition-all md:flex ${collapsed ? "w-16" : "w-60"}`}>
      <div className="flex items-center gap-2 px-4 py-5">
        <Logo size={30} />
        {!collapsed && <div className="font-mono text-sm font-bold text-text-primary">CrimeIQ KSP</div>}
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {ITEMS.map((it) => {
          const active = it.to === "/dashboard" ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          const locked = "perm" in it && it.perm && !hasPermission(it.perm);
          const badge = "badgeKey" in it && it.badgeKey === "alerts" ? unreadAlerts : 0;
          return (
            <Link key={it.to} to={it.to} title={it.label}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-accent/10 text-accent" : "text-text-primary hover:bg-elevated"}`}>
              <span className={`absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r bg-accent transition-all ${active ? "w-1" : "w-0 group-hover:w-0.5"}`} />
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
              {!collapsed && badge > 0 && <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white animate-pulse-ring">{badge}</span>}
              {!collapsed && locked && <Lock size={12} className="text-muted" />}
            </Link>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed((v) => !v)} className="m-3 flex items-center justify-center rounded-lg border border-soft bg-surface py-1.5 text-muted transition hover:bg-elevated">
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-soft bg-surface/95 py-1.5 backdrop-blur md:hidden">
      {ITEMS.map((it) => {
        const active = it.to === "/dashboard" ? pathname === it.to : pathname.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link key={it.to} to={it.to} className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] ${active ? "text-accent" : "text-muted"}`}>
            <Icon size={18} />
            {active && <span className="truncate">{it.label.split(" ")[0]}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
