import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/dashboard/Card";
import { useChartColors } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { districtStats } from "@/data/mockData";
import { useNotifications } from "@/context/NotificationsContext";
import { relTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/alerts")({ ssr: false, component: AlertsPage });

const SEV_COLORS = { critical: "#EF4444", high: "#F59E0B", medium: "#FBBF24" };

function AlertsPage() {
  const c = useChartColors();
  const { user } = useAuth();
  const { alerts: anomalyAlerts, dismiss, markRead, markAllRead, clearAll } = useNotifications();
  const canEscalate = user && (user.role === "SCRB_ADMIN" || user.role === "DISTRICT_ANALYST");
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "unread" | "resolved">("all");
  const list = anomalyAlerts.filter((a) => filter === "all" ? true : filter === "unread" ? a.unread : filter === "resolved" ? a.resolved : a.severity === filter);
  const byType = Object.entries(anomalyAlerts.reduce<Record<string, number>>((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const TYPE_COLORS = ["#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B", "#10B981"];
  const byDay = Array.from({ length: 14 }, (_, i) => ({ d: `D-${13 - i}`, count: Math.floor(2 + Math.random() * 8) }));
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {(["all", "critical", "high", "medium", "unread", "resolved"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs capitalize ${filter === f ? "bg-accent text-white" : "border border-soft hover:bg-elevated"}`}>{f}</button>
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { markAllRead(); toast.success("All marked as read"); }} className="rounded-lg border border-soft px-3 py-1.5 text-xs hover:bg-elevated">Mark all read</button>
              <button onClick={() => { clearAll(); toast.success("All cleared"); }} className="rounded-lg border border-soft px-3 py-1.5 text-xs text-danger hover:bg-danger/10">Clear all</button>
            </div>
          </div>
        </Card>
        {list.length === 0 && (
          <Card><div className="py-10 text-center text-sm text-muted">No alerts match this filter.</div></Card>
        )}
        <div className="space-y-2">
          {list.map((a) => (
            <div key={a.id} className="relative rounded-xl border border-soft bg-surface p-4 pl-5 transition hover:border-[var(--accent)]/40">
              <div className="absolute left-0 top-0 h-full w-1 rounded-l" style={{ background: SEV_COLORS[a.severity] }}/>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {a.unread && <span className="inline-block h-2 w-2 rounded-full bg-accent"/>}
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase text-white" style={{ background: SEV_COLORS[a.severity] }}>{a.severity}</span>
                    <span className="text-[11px] font-semibold text-muted">{a.type}</span>
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-text-primary">{a.crimeType} incidents surge in {a.district}</div>
                  <div className="mt-1 text-xs text-muted">{a.description}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted">
                    <span className="rounded bg-elevated px-1.5 py-0.5">{a.district}</span>
                    <span className="rounded bg-elevated px-1.5 py-0.5">{a.crimeType}</span>
                    <span>· {relTime(a.timestamp)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => { markRead(a.id); toast.info(`Investigating ${a.id}`); }} className="rounded-lg bg-accent px-3 py-1 text-[11px] font-semibold text-white">Investigate</button>
                  <button onClick={() => { dismiss(a.id); toast.success("Dismissed"); }} className="rounded-lg border border-soft px-3 py-1 text-[11px] hover:bg-elevated">Dismiss</button>
                  {canEscalate && <button onClick={() => { markRead(a.id); toast.success("Escalated to SCRB"); }} className="rounded-lg bg-danger px-3 py-1 text-[11px] font-semibold text-white">Escalate</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Card title="Alert Statistics">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={byType} dataKey="value" innerRadius={40} outerRadius={70}>{byType.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/></PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg bg-elevated p-2"><div className="font-mono text-lg font-bold">{anomalyAlerts.length}</div><div className="text-muted">Total</div></div>
            <div className="rounded-lg bg-elevated p-2"><div className="font-mono text-lg font-bold text-danger">{anomalyAlerts.filter((a) => a.severity === "critical").length}</div><div className="text-muted">Critical</div></div>
          </div>
        </Card>
        <Card title="Alerts · Last 14 Days">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={byDay}><CartesianGrid stroke={c.grid} strokeDasharray="3 3"/><XAxis dataKey="d" stroke={c.axis} fontSize={10}/><YAxis stroke={c.axis} fontSize={10}/><Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/><Bar dataKey="count" fill="var(--accent)" radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top Flagged Districts">
          <ul className="space-y-1.5 text-xs">{districtStats.slice(0, 5).map((d) => <li key={d.name} className="flex justify-between"><span>{d.name}</span><span className="font-mono text-muted">{d.pendingCount}</span></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
