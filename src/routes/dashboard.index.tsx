import { createFileRoute, Link } from "@tanstack/react-router";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/dashboard/Card";
import { useChartColors, CRIME_COLORS } from "@/context/ThemeContext";
import { monthlyTrends, districtStats, CRIME_TYPES } from "@/data/mockData";
import { relTime } from "@/lib/format";
import { useNotifications } from "@/context/NotificationsContext";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({ ssr: false, component: Overview });

function Overview() {
  const c = useChartColors();
  const { alerts, pushLive } = useNotifications();
  const pieData = CRIME_TYPES.map((t) => ({ name: t, value: monthlyTrends.reduce((s, r) => s + (r[t] as number), 0) }));
  const trend12 = monthlyTrends.slice(-12);
  const byDistrict = [...districtStats].sort((a, b) => b.crimeCount - a.crimeCount);
  const feed = alerts.slice(0, 8);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Incidents YTD" value={12847} delta={4.2} />
        <KpiCard label="Active Cases" value={3241} delta={-2.1} accent="var(--warning)" />
        <KpiCard label="Solved Rate" value={67.3} decimals={1} suffix="%" delta={3.4} accent="var(--success)" />
        <KpiCard label="High-Risk Zones" value={14} delta={8.1} accent="var(--danger)" />
        <KpiCard label="Repeat Offenders" value={89} delta={1.2} accent="var(--purple)" />
        <KpiCard label="AI Anomalies" value={23} delta={12.5} accent="var(--accent)" />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Card title="Monthly Crime Trend by Category" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend12}>
              <CartesianGrid stroke={c.grid} strokeDasharray="3 3"/>
              <XAxis dataKey="month" stroke={c.axis} fontSize={11}/>
              <YAxis stroke={c.axis} fontSize={11}/>
              <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              {CRIME_TYPES.map((t) => <Line key={t} type="monotone" dataKey={t} stroke={CRIME_COLORS[t]} strokeWidth={1.8} dot={false}/>)}
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Crime Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {pieData.map((e) => <Cell key={e.name} fill={CRIME_COLORS[e.name]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top Districts">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDistrict} layout="vertical">
              <CartesianGrid stroke={c.grid} strokeDasharray="3 3"/>
              <XAxis type="number" stroke={c.axis} fontSize={10}/>
              <YAxis type="category" dataKey="name" stroke={c.axis} fontSize={10} width={90}/>
              <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
              <Bar dataKey="crimeCount" fill="var(--accent)" radius={[0, 4, 4, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="District Comparison">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-soft text-left text-muted"><th className="py-2">District</th><th>Total</th><th>Solved</th><th>Pending</th><th>YoY</th></tr></thead>
              <tbody>
                {byDistrict.map((d) => (
                  <tr key={d.name} className="border-b border-soft">
                    <td className="py-2 font-medium text-text-primary">{d.name}</td>
                    <td className="font-mono">{d.crimeCount.toLocaleString()}</td>
                    <td className="font-mono text-success">{d.solvedCount.toLocaleString()}</td>
                    <td className="font-mono text-warning">{d.pendingCount.toLocaleString()}</td>
                    <td className={`font-mono ${d.yoyChange >= 0 ? "text-danger" : "text-success"}`}>{d.yoyChange > 0 ? "+" : ""}{d.yoyChange}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card
          title="Live Incident Feed"
          action={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
                <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-danger" /> Live
              </span>
              <button onClick={() => pushLive()} className="inline-flex items-center gap-1 rounded-md border border-soft bg-elevated px-2 py-1 text-[10px] font-semibold text-text-primary transition hover:bg-accent/10 hover:text-accent">
                <Activity size={11}/> Simulate
              </button>
            </div>
          }
        >
          {feed.length === 0 ? (
            <div className="rounded-lg border border-dashed border-soft p-6 text-center text-xs text-muted">All clear — waiting for new signals…</div>
          ) : (
            <ul className="space-y-2 max-h-[300px] overflow-auto pr-1">
              {feed.map((a) => (
                <li key={a.id} className="animate-slide-up flex items-start justify-between gap-3 rounded-lg border border-soft bg-elevated/40 p-3 transition hover:bg-elevated">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white ${a.severity==="critical"?"bg-danger":a.severity==="high"?"bg-warning":"bg-accent"}`}>{a.severity}</span>
                      <span className="truncate text-xs font-medium text-text-primary">{a.type}: {a.crimeType}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted truncate">{a.district} · {relTime(a.timestamp)}</div>
                  </div>
                  <Link to="/dashboard/alerts" className="shrink-0 self-center text-xs font-semibold text-accent hover:underline">→</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
