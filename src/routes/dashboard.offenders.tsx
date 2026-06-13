import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/dashboard/Card";
import { offenders, type Offender } from "@/data/mockData";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/offenders")({ ssr: false, component: OffendersPage });

function OffendersPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Offender | null>(null);
  const filtered = offenders.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()) || o.id.includes(q.toUpperCase()));
  const riskColor = (s: number) => s > 70 ? "var(--danger)" : s > 40 ? "var(--warning)" : "var(--success)";
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or ID…" className="w-full rounded-lg border border-soft bg-surface py-2 pl-9 pr-3 text-sm outline-none"/>
          </div>
          <div className="text-xs text-muted">Showing {filtered.length} of {offenders.length} offenders</div>
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-xl border border-soft bg-surface p-4 transition hover:border-[var(--accent)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: riskColor(o.riskScore) }}>{o.photoInitials}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">{o.name}</div>
                <div className="text-[11px] text-muted">{o.age}y · {o.gender} · {o.district}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {o.moTags.map((t) => <span key={t} className="rounded-full bg-elevated px-2 py-0.5 text-[10px]">{t}</span>)}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-muted">Risk</span><span className="font-mono font-bold" style={{ color: riskColor(o.riskScore) }}>{o.riskScore}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated"><div className="h-full" style={{ width: `${o.riskScore}%`, background: riskColor(o.riskScore) }}/></div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted"><span>{o.linkedIncidents.length} incidents · {o.convictions} convictions</span></div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${o.status === "active" ? "bg-danger/15 text-danger" : o.status === "incarcerated" ? "bg-elevated text-text-primary" : "bg-warning/15 text-warning"}`}>{o.status}</span>
              <button onClick={() => setOpen(o)} className="text-xs text-accent hover:underline">View Profile →</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/50" onClick={() => setOpen(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: riskColor(open.riskScore) }}>{open.photoInitials}</div>
              <div><div className="text-lg font-bold text-text-primary">{open.name}</div><div className="text-xs text-muted">{open.id} · {open.age}y · {open.gender}</div><div className="text-xs text-muted">{open.district}</div></div>
            </div>
            <div className="mt-5"><div className="text-xs font-semibold uppercase tracking-wider text-muted">Risk Score</div><div className="mt-1 text-3xl font-mono font-bold" style={{ color: riskColor(open.riskScore) }}>{open.riskScore}</div></div>
            <div className="mt-5"><div className="text-xs font-semibold uppercase tracking-wider text-muted">MO Analysis</div><p className="mt-1 text-sm text-text-primary">Subject exhibits a consistent pattern of {open.primaryMO.toLowerCase()}, with associated activity including {open.moTags.join(", ")}. Cross-jurisdictional links observed across {open.associatedOffenders.length} known associates.</p></div>
            <div className="mt-5"><div className="text-xs font-semibold uppercase tracking-wider text-muted">Linked Incidents ({open.linkedIncidents.length})</div><ul className="mt-1.5 max-h-40 space-y-1 overflow-auto text-xs">{open.linkedIncidents.slice(0, 8).map((i) => <li key={i} className="rounded border border-soft px-2 py-1 font-mono">{i}</li>)}</ul></div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-lg bg-danger px-3 py-2 text-xs font-semibold text-white">Flag</button>
              <button className="flex-1 rounded-lg border border-soft px-3 py-2 text-xs">Add Note</button>
              <button onClick={() => { toast.info(`Generating report for ${open.name}...`); setTimeout(() => toast.success("Report ready — Download"), 1500); }} className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white">Export PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
