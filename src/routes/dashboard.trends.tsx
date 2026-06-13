import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { Card } from "@/components/dashboard/Card";
import { useChartColors, CRIME_COLORS } from "@/context/ThemeContext";
import { monthlyTrends, calendarHeat, hourlyPattern, correlationMatrix, CRIME_TYPES } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/trends")({ ssr: false, component: TrendsPage });

function TrendsPage() {
  const c = useChartColors();
  const maxCal = Math.max(...calendarHeat.map((d) => d.count));
  return (
    <div className="space-y-4">
      <Card title="Temporal Analysis — 42-Month Stacked View">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={monthlyTrends}>
            <CartesianGrid stroke={c.grid} strokeDasharray="3 3"/>
            <XAxis dataKey="month" stroke={c.axis} fontSize={10}/>
            <YAxis stroke={c.axis} fontSize={10}/>
            <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
            {CRIME_TYPES.map((t) => <Area key={t} type="monotone" dataKey={t} stackId="1" stroke={CRIME_COLORS[t]} fill={CRIME_COLORS[t]} fillOpacity={0.45}/>)}
            <Brush dataKey="month" height={24} fill="var(--bg-elevated)" stroke="var(--accent)"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="365-Day Calendar Heatmap">
          <div className="flex gap-0.5 overflow-x-auto pb-2">
            {Array.from({ length: 53 }, (_, w) => (
              <div key={w} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }, (_, d) => {
                  const cell = calendarHeat[w * 7 + d];
                  if (!cell) return <div key={d} className="h-3 w-3"/>;
                  const t = cell.count / maxCal;
                  const bg = t === 0 ? "var(--bg-elevated)" : t < 0.33 ? "rgba(245,158,11,0.4)" : t < 0.66 ? "rgba(245,158,11,0.85)" : "var(--danger)";
                  return <div key={d} title={`${cell.date}: ${cell.count} (${cell.topType})`} className="h-3 w-3 rounded-[2px]" style={{ background: bg }}/>;
                })}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Time-of-Day Polar Pattern">
          <svg viewBox="-150 -150 300 300" className="mx-auto h-72 w-full">
            <circle r="120" fill="none" stroke={c.grid}/>
            <circle r="80" fill="none" stroke={c.grid}/>
            <circle r="40" fill="none" stroke={c.grid}/>
            {hourlyPattern.map((h) => {
              const max = Math.max(...hourlyPattern.map((p) => p.count));
              const len = 30 + (h.count / max) * 90;
              const ang = (h.hour / 24) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(ang) * len, y = Math.sin(ang) * len;
              const color = h.count / max > 0.7 ? "#EF4444" : h.count / max > 0.5 ? "#F59E0B" : "#3B82F6";
              return <g key={h.hour}><line x1="0" y1="0" x2={x} y2={y} stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.85"/><text x={Math.cos(ang) * 135} y={Math.sin(ang) * 135 + 3} textAnchor="middle" fontSize="9" fill={c.axis}>{h.hour}</text></g>;
            })}
            <text y="5" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--danger)">PEAK 10PM–2AM</text>
          </svg>
        </Card>
      </div>
      <Card title="Crime Correlation Matrix">
        <div className="overflow-x-auto">
          <table className="text-[11px]">
            <thead><tr><th></th>{CRIME_TYPES.map((t) => <th key={t} className="rotate-[-30deg] px-1 py-2 text-muted">{t.slice(0, 6)}</th>)}</tr></thead>
            <tbody>
              {CRIME_TYPES.map((t, i) => (
                <tr key={t}><td className="pr-2 text-right font-medium text-text-primary">{t.slice(0, 10)}</td>
                  {correlationMatrix[i].map((v, j) => {
                    const intensity = Math.abs(v);
                    const bg = v >= 0 ? `rgba(239,68,68,${intensity})` : `rgba(37,99,235,${intensity})`;
                    return <td key={j} className="h-8 w-12 text-center font-mono" style={{ background: bg, color: intensity > 0.5 ? "white" : "var(--text-primary)" }} title={`${t} ↔ ${CRIME_TYPES[j]}: ${v}`}>{v.toFixed(2)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
