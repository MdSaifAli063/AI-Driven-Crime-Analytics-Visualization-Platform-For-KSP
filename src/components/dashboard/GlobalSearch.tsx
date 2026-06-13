import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, FileWarning, UserCircle2, MapPin, Bell, CornerDownLeft } from "lucide-react";
import { incidents, offenders, districtStats } from "@/data/mockData";
import { useNotifications } from "@/context/NotificationsContext";

type Hit = {
  id: string;
  type: "incident" | "offender" | "district" | "alert";
  title: string;
  subtitle: string;
  to: string;
};

const ICONS = {
  incident: FileWarning,
  offender: UserCircle2,
  district: MapPin,
  alert: Bell,
} as const;

const TYPE_LABEL = { incident: "Incident", offender: "Offender", district: "District", alert: "Alert" };

export function GlobalSearch() {
  const navigate = useNavigate();
  const { alerts } = useNotifications();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const hits: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: Hit[] = [];
    const match = (s: string) => s.toLowerCase().includes(term);

    for (const i of incidents) {
      if (out.length >= 18) break;
      if (match(i.id) || match(i.crimeType) || match(i.district) || match(i.policeStation)) {
        out.push({ id: i.id, type: "incident", title: `${i.id} · ${i.crimeType}`, subtitle: `${i.district} · ${i.status}`, to: "/dashboard/map" });
      }
    }
    for (const o of offenders) {
      if (out.length >= 26) break;
      if (match(o.id) || match(o.name) || match(o.district) || match(o.primaryMO)) {
        out.push({ id: o.id, type: "offender", title: `${o.name}`, subtitle: `${o.id} · ${o.district} · risk ${o.riskScore}`, to: "/dashboard/offenders" });
      }
    }
    for (const d of districtStats) {
      if (match(d.name)) {
        out.push({ id: d.name, type: "district", title: d.name, subtitle: `${d.crimeCount.toLocaleString()} incidents`, to: "/dashboard/map" });
      }
    }
    for (const a of alerts) {
      if (out.length >= 34) break;
      if (match(a.id) || match(a.type) || match(a.district) || match(a.crimeType)) {
        out.push({ id: a.id, type: "alert", title: `${a.type}: ${a.crimeType}`, subtitle: `${a.district} · ${a.severity}`, to: "/dashboard/alerts" });
      }
    }
    return out.slice(0, 30);
  }, [q, alerts]);

  useEffect(() => { setActive(0); }, [q]);

  const go = (h: Hit) => {
    setOpen(false);
    setQ("");
    navigate({ to: h.to });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && hits[active]) { e.preventDefault(); go(hits[active]); }
  };

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search incidents, offenders…"
        className="w-64 rounded-lg border border-soft bg-surface py-1.5 pl-8 pr-12 text-xs text-text-primary outline-none transition focus:w-80 focus:border-[var(--accent)]"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-soft bg-elevated px-1.5 py-0.5 font-mono text-[9px] text-muted lg:inline">⌘K</kbd>

      {open && (q.length > 0 || hits.length > 0) && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[26rem] overflow-hidden rounded-xl border border-soft bg-surface shadow-2xl ring-1 ring-black/5">
          {hits.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="text-sm font-semibold text-text-primary">No results for "{q}"</div>
              <div className="mt-1 text-[11px] text-muted">Try a district, offender name, INC- or OFF- id, or crime type.</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-soft bg-elevated/50 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted">
                <span>{hits.length} results</span>
                <span className="flex items-center gap-1">↑↓ navigate · <CornerDownLeft size={10}/> open · Esc close</span>
              </div>
              <ul className="max-h-96 overflow-auto">
                {hits.map((h, i) => {
                  const Icon = ICONS[h.type];
                  return (
                    <li key={`${h.type}-${h.id}-${i}`}>
                      <button
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(h)}
                        className={`flex w-full items-center gap-3 border-b border-soft px-3 py-2.5 text-left transition ${i === active ? "bg-elevated" : "hover:bg-elevated/60"}`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent`}><Icon size={14}/></div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-text-primary">{h.title}</div>
                          <div className="truncate text-[11px] text-muted">{h.subtitle}</div>
                        </div>
                        <span className="rounded bg-elevated px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted">{TYPE_LABEL[h.type]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}