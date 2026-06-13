import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { anomalyAlerts as RAW_ALERTS, type AnomalyAlert } from "@/data/mockData";
import { DISTRICTS, CRIME_TYPES } from "@/data/mockData";

const READ_KEY = "crimeiq:alerts:read";
const CLEARED_KEY = "crimeiq:alerts:cleared";
const LIVE_KEY = "crimeiq:alerts:live";
const ALERT_TYPES = ["Spike Detected", "New Association Found", "Unusual Pattern", "MO Match", "Cluster Forming"] as const;
const SEVERITIES = ["critical", "high", "medium"] as const;

function makeLiveAlert(seq: number): AnomalyAlert {
  const sev = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)].name;
  const crimeType = CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)];
  const pct = 25 + Math.floor(Math.random() * 90);
  return {
    id: `LIV-${Date.now()}-${seq}`,
    severity: sev,
    type: ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)],
    district,
    crimeType,
    description: `${pct}% spike in ${crimeType.toLowerCase()} signals detected in ${district} grid.`,
    timestamp: new Date().toISOString(),
    resolved: false,
    relatedIncidents: [],
    unread: true,
  };
}

interface NotificationsCtx {
  alerts: AnomalyAlert[];
  unreadCount: number;
  liveCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  restoreAll: () => void;
  pushLive: () => void;
}

const Ctx = createContext<NotificationsCtx | null>(null);

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); }
}
function saveSet(key: string, s: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify([...s]));
}
function loadLive(): AnomalyAlert[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LIVE_KEY) || "[]"); } catch { return []; }
}
function saveLive(a: AnomalyAlert[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIVE_KEY, JSON.stringify(a.slice(0, 50)));
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
  const [liveAlerts, setLiveAlerts] = useState<AnomalyAlert[]>([]);

  useEffect(() => {
    setReadIds(loadSet(READ_KEY));
    setClearedIds(loadSet(CLEARED_KEY));
    setLiveAlerts(loadLive());
  }, []);

  const pushLive = useCallback(() => {
    setLiveAlerts((prev) => {
      const next = [makeLiveAlert(prev.length), ...prev].slice(0, 50);
      saveLive(next);
      const a = next[0];
      toast(`${a.type}: ${a.crimeType} in ${a.district}`, {
        description: a.description,
        className: a.severity === "critical" ? "border-l-4 border-l-red-500" : a.severity === "high" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-sky-500",
      });
      return next;
    });
  }, []);

  // Realtime simulator — emit a new alert every 18-32s while tab is visible
  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 18000 + Math.random() * 14000;
      timer = setTimeout(() => {
        if (document.visibilityState === "visible") pushLive();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [pushLive]);

  const alerts = useMemo(
    () => [...liveAlerts, ...RAW_ALERTS]
      .filter((a) => !clearedIds.has(a.id))
      .map((a) => ({ ...a, unread: a.unread && !readIds.has(a.id) })),
    [readIds, clearedIds, liveAlerts]
  );
  const unreadCount = useMemo(() => alerts.filter((a) => a.unread && !a.resolved).length, [alerts]);
  const liveCount = liveAlerts.length;

  const markAllRead = useCallback(() => {
    const next = new Set(readIds);
    [...liveAlerts, ...RAW_ALERTS].forEach((a) => next.add(a.id));
    setReadIds(next); saveSet(READ_KEY, next);
  }, [readIds, liveAlerts]);

  const markRead = useCallback((id: string) => {
    const next = new Set(readIds); next.add(id);
    setReadIds(next); saveSet(READ_KEY, next);
  }, [readIds]);

  const dismiss = useCallback((id: string) => {
    const next = new Set(clearedIds); next.add(id);
    setClearedIds(next); saveSet(CLEARED_KEY, next);
  }, [clearedIds]);

  const clearAll = useCallback(() => {
    const next = new Set(clearedIds);
    [...liveAlerts, ...RAW_ALERTS].forEach((a) => next.add(a.id));
    setClearedIds(next); saveSet(CLEARED_KEY, next);
  }, [clearedIds, liveAlerts]);

  const restoreAll = useCallback(() => {
    setClearedIds(new Set()); saveSet(CLEARED_KEY, new Set());
    setReadIds(new Set()); saveSet(READ_KEY, new Set());
  }, []);

  return <Ctx.Provider value={{ alerts, unreadCount, liveCount, markAllRead, markRead, dismiss, clearAll, restoreAll, pushLive }}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNotifications must be inside NotificationsProvider");
  return v;
}