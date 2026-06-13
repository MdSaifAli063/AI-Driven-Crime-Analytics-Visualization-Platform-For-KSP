import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/dashboard/Card";
import { networkNodes, networkEdges } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/network")({ ssr: false, component: NetworkPage });

const TYPE_COLORS: Record<string, string> = { offender: "#EF4444", victim: "#3B82F6", location: "#F59E0B", organization: "#8B5CF6" };

function NetworkPage() {
  return (
    <ProtectedRoute permission="network_analysis" pageName="Network Analysis">
      <NetworkInner />
    </ProtectedRoute>
  );
}

function NetworkInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Graph, setGraph] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [dims, setDims] = useState({ w: 600, h: 600 });
  useEffect(() => { import("react-force-graph-2d").then((m) => setGraph(() => m.default)); }, []);
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setDims({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [Graph]);
  const data = { nodes: networkNodes.map((n) => ({ ...n })), links: networkEdges.map((e) => ({ ...e })) };
  return (
    <div className="grid h-[calc(100vh-160px)] gap-4 lg:grid-cols-[1fr_320px]">
      <div ref={containerRef} className="relative overflow-hidden rounded-xl border border-soft bg-base">
        {Graph ? (
          <Graph graphData={data} width={dims.w} height={dims.h} backgroundColor="rgba(0,0,0,0)"
            nodeColor={(n: any) => TYPE_COLORS[n.type]} nodeRelSize={5} nodeLabel={(n: any) => `${n.label} (${n.type})`}
            linkColor={() => "rgba(120,120,150,0.4)"} linkWidth={(l: any) => l.weight * 1.5}
            onNodeClick={(n: any) => setSelected(n)} cooldownTicks={80}/>
        ) : <div className="skeleton h-full w-full"/>}
      </div>
      <div className="space-y-3 overflow-y-auto">
        <Card title="Legend">
          <ul className="space-y-1.5 text-xs">
            {Object.entries(TYPE_COLORS).map(([k, v]) => <li key={k} className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ background: v }}/><span className="capitalize text-text-primary">{k}</span></li>)}
          </ul>
        </Card>
        {selected ? (
          <Card title="Node Profile">
            <div className="flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-full text-white text-lg font-bold" style={{ background: TYPE_COLORS[selected.type] }}>{selected.label.slice(0, 2)}</div><div><div className="text-sm font-semibold text-text-primary">{selected.label}</div><div className="text-[11px] capitalize text-muted">{selected.type} · {selected.district}</div></div></div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted">Risk Score</span><span className="font-mono font-bold">{selected.riskScore}</span></div>
              <div className="flex justify-between"><span className="text-muted">Incidents</span><span className="font-mono font-bold">{selected.incidentCount}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-elevated"><div className="h-full bg-danger" style={{ width: `${selected.riskScore}%` }}/></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <button className="rounded-lg bg-danger px-2.5 py-1 text-[11px] font-semibold text-white">Flag</button>
              <button className="rounded-lg border border-soft px-2.5 py-1 text-[11px] text-text-primary">Add Note</button>
            </div>
          </Card>
        ) : <Card title="Tip"><p className="text-xs text-muted">Click any node in the graph to see profile, risk score, and quick actions.</p></Card>}
      </div>
    </div>
  );
}
