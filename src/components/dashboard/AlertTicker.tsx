import { useNotifications } from "@/context/NotificationsContext";

export function AlertTicker() {
  const { alerts } = useNotifications();
  const items = alerts.slice(0, 12).map((a) => {
    const icon = a.severity === "critical" ? "🔴" : a.severity === "high" ? "⚠️" : "🟡";
    const action = a.resolved ? "RESOLVED" : a.type.toUpperCase();
    return `${icon} ${action}: ${a.crimeType} in ${a.district}`;
  });

  if (items.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center bg-elevated/40 px-4 text-[11px] text-muted">
        ✓ All clear — no active alerts
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div
      className="marquee-pause relative h-8 w-full overflow-hidden bg-elevated/30"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div className="flex h-full items-center gap-0 animate-marquee whitespace-nowrap">
        {doubled.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-6 text-[11px] font-medium tracking-wide text-text-primary"
          >
            {s}
            <span className="mx-2 text-muted opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
