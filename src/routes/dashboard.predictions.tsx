import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/dashboard/Card";
import { useChartColors } from "@/context/ThemeContext";
import { predictedRisks, buildForecast, districtStats, aiInsights, CRIME_TYPES, type CrimeType } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/predictions")({ ssr: false, component: () => (
  <ProtectedRoute permission="ai_predictions" pageName="AI Predictions"><PredictionsInner/></ProtectedRoute>
)});

function Gauge({ value }: { value: number }) {
  const angle = (value / 100) * 180 - 90;
  const color = value > 70 ? "#EF4444" : value > 40 ? "#F59E0B" : "#10B981";
  return (
    <svg viewBox="0 0 120 70" className="mx-auto h-20 w-32">
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--bg-elevated)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(value/100)*157} 157`}/>
      <line x1="60" y1="60" x2={60 + 35 * Math.cos((angle * Math.PI)/180)} y2={60 + 35 * Math.sin((angle * Math.PI)/180)} stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="60" y="55" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="16" fontWeight="700" fill="var(--text-primary)">{value}</text>
    </svg>
  );
}

function PredictionsInner() {
  const c = useChartColors();
  const [crime, setCrime] = useState<CrimeType>("Cybercrime");
  const fc = buildForecast(crime);
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-text-primary">Predictive Intelligence Engine</div>
            <div className="text-[11px] text-muted">Last updated: {new Date().toLocaleString()}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-[11px] text-success">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success"/> AI/ML Models Active · Confidence Threshold 75%
          </div>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {predictedRisks.map((r) => (
          <Card key={r.district}>
            <div className="text-xs font-semibold text-text-primary">{r.district}</div>
            <Gauge value={r.riskScore}/>
            <div className="text-center text-[11px] text-muted">Top: <span className="font-semibold text-text-primary">{r.topCrimeType}</span></div>
            <div className="mt-1 flex justify-between text-[10px] text-muted"><span>Confidence {r.confidence}%</span><span className={r.trend >= 0 ? "text-danger" : "text-success"}>{r.trend >= 0 ? "↑" : "↓"}{Math.abs(r.trend)}%</span></div>
          </Card>
        ))}
      </div>
      <Card title="90-Day Forecast" action={<select value={crime} onChange={(e) => setCrime(e.target.value as CrimeType)} className="rounded border border-soft bg-surface px-2 py-1 text-xs">{CRIME_TYPES.map((t) => <option key={t}>{t}</option>)}</select>}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={fc}>
            <CartesianGrid stroke={c.grid} strokeDasharray="3 3"/>
            <XAxis dataKey="date" stroke={c.axis} fontSize={10} interval={14}/>
            <YAxis stroke={c.axis} fontSize={10}/>
            <Tooltip contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
            <Area type="monotone" dataKey="upper" stroke="none" fill="var(--accent)" fillOpacity={0.15}/>
            <Area type="monotone" dataKey="lower" stroke="none" fill="var(--bg-base)" fillOpacity={1}/>
            <Line type="monotone" dataKey="actual" stroke="var(--accent)" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="forecast" stroke="var(--purple)" strokeWidth={2} strokeDasharray="5 5" dot={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Socio-Economic Correlation">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid stroke={c.grid}/>
              <XAxis type="number" dataKey="socioEconomicIndex" name="Socio-Econ Index" stroke={c.axis} fontSize={10}/>
              <YAxis type="number" dataKey="crimeCount" name="Crime Count" stroke={c.axis} fontSize={10}/>
              <ZAxis type="number" dataKey="population" range={[80, 400]}/>
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}/>
              <Scatter data={districtStats} fill="var(--accent)"/>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
        <Card title="AI Insights">
          <ul className="space-y-2">
            {aiInsights.map((i) => (
              <li key={i.headline} className="rounded-lg border border-soft p-3">
                <div className="flex items-center gap-2"><span className="text-xl">{i.icon}</span><span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">{i.confidence}% CONF</span><span className="text-[10px] text-muted">{i.category}</span></div>
                <div className="mt-1.5 text-xs font-semibold text-text-primary">{i.headline}</div>
                <div className="mt-1 text-[11px] text-muted">{i.detail}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
