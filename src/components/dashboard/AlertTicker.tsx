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
      <div className="flex h-8 items-center justify-center bg-elevated/20 border-b border-soft px-4 text-[11px] font-medium text-text-muted">
        ✓ System Nominal — No active district anomalies detected
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div className="relative flex h-8 w-full items-center overflow-hidden border-b border-soft bg-elevated/15 backdrop-blur-sm">
      {/* Fixed Live Label */}
      <div className="z-10 flex h-full items-center bg-surface border-r border-soft px-3 text-[10px] font-bold tracking-wider text-danger uppercase select-none">
        <span className="live-dot mr-1.5 h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
        Live Intel
      </div>
      
      {/* Ticker Content */}
      <div
        className="marquee-pause relative flex-1 h-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        <div className="flex w-max h-full items-center gap-0 animate-marquee whitespace-nowrap">
          {doubled.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-6 text-[10px] sm:text-[11px] font-medium tracking-wide text-text-primary"
            >
              {s}
              <span className="mx-2 text-muted opacity-40">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
