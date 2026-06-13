import { useNotifications } from "@/context/NotificationsContext";

export function AlertTicker() {
  const { alerts } = useNotifications();
  const items = alerts.slice(0, 10).map((a) => {
    const icon = a.severity === "critical" ? "🔴" : a.severity === "high" ? "⚠" : "🟡";
    const action = a.resolved ? "RESOLVED" : a.type.toUpperCase();
    return `${icon} ${action}: ${a.crimeType} in ${a.district}`;
  });
  if (items.length === 0) {
    return (
      <div className="relative flex h-9 flex-1 items-center justify-center overflow-hidden rounded-lg border border-soft bg-elevated px-3 text-xs text-muted">
        ✓ All clear — no active alerts
      </div>
    );
  }
  const doubled = [...items, ...items];
  return (
    <div className="marquee-pause relative flex h-9 flex-1 items-center overflow-hidden rounded-lg border border-soft bg-elevated px-3">
      <div className="flex shrink-0 animate-marquee gap-8 whitespace-nowrap text-xs text-muted">
        {doubled.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}
