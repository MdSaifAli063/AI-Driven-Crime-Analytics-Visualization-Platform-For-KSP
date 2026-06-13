import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/dashboard/Card";
import { useTheme } from "@/context/ThemeContext";
import { districtStats, hotspots } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/map")({ ssr: false, component: MapPage });

function MapPage() {
  const { theme } = useTheme();
  const [M, setM] = useState<any>(null);
  useEffect(() => { Promise.all([import("react-leaflet"), import("leaflet")]).then(([r, L]) => setM({ r, L: L.default || L })); }, []);
  if (!M) return <div className="skeleton h-[600px] w-full"/>;
  const { MapContainer, TileLayer, CircleMarker, Popup, Circle } = M.r;
  return (
    <div className="grid gap-4 lg:h-[calc(100vh-160px)] lg:grid-cols-[1fr_320px]">
      <div className={`h-[55vh] min-h-[320px] overflow-hidden rounded-xl border border-soft lg:h-auto ${theme === "dark" ? "leaflet-tile-dark" : ""}`}>
        <MapContainer center={[15.3173, 75.7139]} zoom={7} style={{ height: "100%", width: "100%", background: "var(--bg-base)" }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {districtStats.map((d) => (
            <CircleMarker key={d.name} center={[d.lat, d.lng]} radius={Math.sqrt(d.crimeCount) / 4} pathOptions={{ color: "var(--accent)", fillColor: "var(--accent)", fillOpacity: 0.3 }}>
              <Popup><div className="font-mono text-xs"><div className="font-bold">{d.name}</div><div>Incidents: {d.crimeCount.toLocaleString()}</div><div>Solved: {d.solvedCount.toLocaleString()}</div><div>YoY: {d.yoyChange}%</div></div></Popup>
            </CircleMarker>
          ))}
          {hotspots.map((h) => (
            <Circle key={h.id} center={[h.lat, h.lng]} radius={h.intensity * 12000} pathOptions={{ color: h.isSpike ? "#EF4444" : "#F59E0B", fillColor: h.isSpike ? "#EF4444" : "#F59E0B", fillOpacity: 0.25, weight: 1 }}>
              <Popup><div className="text-xs"><div className="font-bold">{h.dominantCrimeType}</div><div>{h.incidentCount} incidents · {h.district}</div>{h.isSpike && <div className="text-danger font-bold">⚠ SPIKE +{h.spikePct}%</div>}</div></Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
      <div className="space-y-3 overflow-y-auto">
        <Card title="Map Layers">
          <ul className="space-y-2 text-xs">
            {["Heatmap", "Cluster Markers", "District Boundaries", "Hotspot Pulse Rings", "Predicted Risk Zones"].map((l) => (
              <li key={l} className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded"/><span>{l}</span></li>
            ))}
          </ul>
        </Card>
        <Card title="Active Spikes">
          <ul className="space-y-2 text-xs">
            {hotspots.filter((h) => h.isSpike).map((h) => (
              <li key={h.id} className="rounded-lg border border-soft p-2.5">
                <div className="flex items-center justify-between"><span className="font-semibold text-text-primary">{h.district}</span><span className="text-danger font-bold">+{h.spikePct}%</span></div>
                <div className="text-[11px] text-muted">{h.dominantCrimeType} · {h.incidentCount} incidents</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
