import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon, HelpCircle, CheckCheck, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AlertTicker } from "./AlertTicker";
import { GlobalSearch } from "./GlobalSearch";
import { HelpDialog } from "./HelpDialog";
import { useNotifications } from "@/context/NotificationsContext";
import { ROLE_LABELS } from "@/data/users";
import { relTime } from "@/lib/format";

const RANGES = ["Today", "7D", "30D", "90D", "1Y"];

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { alerts, unreadCount, markAllRead, markRead, clearAll } = useNotifications();
  const [range, setRange] = useState("30D");
  const [openUser, setOpenUser] = useState(false);
  const [openBell, setOpenBell] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (!typing && e.key === "?") { e.preventDefault(); setOpenHelp(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!user) return null;
  const unread = unreadCount;

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-soft glass-strong px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
      <div className="min-w-0 flex items-center gap-2">
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-bold text-text-primary sm:text-base md:text-lg">{title}</div>
          <div className="hidden text-[10px] uppercase tracking-wider text-muted sm:flex sm:items-center sm:gap-1.5">
            CrimeIQ · SCRB
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-soft bg-elevated px-1.5 py-0.5 text-[9px] font-semibold text-danger">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-danger" /> LIVE
            </span>
          </div>
        </div>
      </div>
      <div className="order-3 w-full md:order-2 md:flex-1 md:w-auto md:max-w-2xl">
        <AlertTicker />
      </div>
      <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
        <select value={range} onChange={(e) => setRange(e.target.value)} className="hidden rounded-lg border border-soft bg-surface px-2.5 py-1.5 text-xs text-text-primary outline-none md:block">
          {RANGES.map((r) => <option key={r}>{r}</option>)}
          <option>Custom</option>
        </select>
        <GlobalSearch />
        <ThemeToggle />
        <div className="relative">
          <button onClick={() => { setOpenBell((v) => !v); setOpenUser(false); }} className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-soft bg-surface text-text-primary transition hover:bg-elevated">
            <Bell size={16} />
            {unread > 0 && (
              <>
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white shadow-md shadow-red-500/30">{unread > 99 ? "99+" : unread}</span>
                <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 animate-ping rounded-full bg-danger opacity-60" />
              </>
            )}
          </button>
          {openBell && (
            <div className="absolute right-[-4.25rem] sm:right-0 top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-[22rem] sm:w-[22rem] overflow-hidden rounded-xl border border-soft bg-surface shadow-2xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-soft bg-gradient-to-r from-[var(--accent)]/10 to-transparent px-3 py-2.5 sm:px-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-primary">Notifications</div>
                  <div className="text-[10px] text-muted">{unread} unread · {alerts.length} total</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { markAllRead(); toast.success("All marked as read"); }} title="Mark all read" disabled={unread === 0} className="inline-flex items-center gap-1 rounded-md border border-soft px-2 py-1 text-[10px] font-medium text-text-primary transition hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-40"><CheckCheck size={11}/> Read</button>
                  <button onClick={() => { clearAll(); toast.success("All notifications cleared"); setOpenBell(false); }} title="Clear all" disabled={alerts.length === 0} className="inline-flex items-center gap-1 rounded-md border border-soft px-2 py-1 text-[10px] font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={11}/> Clear</button>
                </div>
              </div>
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-muted"><Inbox size={20}/></div>
                  <div className="text-sm font-semibold text-text-primary">You're all caught up</div>
                  <div className="mt-1 text-[11px] text-muted">No new anomaly alerts at this time.</div>
                </div>
              ) : (
                <ul className="max-h-80 overflow-auto">
                  {alerts.slice(0, 6).map((a) => (
                    <li key={a.id}>
                      <button onClick={() => { markRead(a.id); setOpenBell(false); navigate({ to: "/dashboard/alerts" }); }} className="block w-full border-b border-soft px-4 py-3 text-left transition hover:bg-elevated">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {a.unread && <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${a.severity==="critical"?"bg-danger text-white":a.severity==="high"?"bg-warning text-white":"bg-elevated text-text-primary"}`}>{a.severity}</span>
                          </div>
                          <span className="text-[10px] text-muted">{relTime(a.timestamp)}</span>
                        </div>
                        <div className="mt-1 text-xs font-medium text-text-primary">{a.type}: {a.crimeType} in {a.district}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => { setOpenBell(false); navigate({ to: "/dashboard/alerts" }); }} className="block w-full border-t border-soft bg-elevated/50 py-2 text-center text-[11px] font-semibold text-accent transition hover:bg-elevated">View all alerts →</button>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => { setOpenUser((v) => !v); setOpenBell(false); }} className="flex items-center gap-2 rounded-lg border border-soft bg-surface py-1 pl-1 pr-2 transition hover:bg-elevated">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">{user.avatar}</div>
            )}
            <ChevronDown size={12} className="text-muted" />
          </button>
          {openUser && (
            <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-xl border border-soft bg-surface shadow-2xl">
              <div className="border-b border-soft px-4 py-3">
                <div className="text-sm font-semibold text-text-primary">{user.name}</div>
                <div className="mt-1 inline-block rounded bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">{ROLE_LABELS[user.role]}</div>
                <div className="mt-1 text-[11px] text-muted">{user.district}</div>
              </div>
              <ul className="py-1 text-sm">
                <li><button onClick={() => { setOpenUser(false); navigate({ to: "/dashboard/profile" }); }} className="flex w-full items-center gap-2 px-4 py-2 text-text-primary hover:bg-elevated"><UserIcon size={14}/> My Profile</button></li>
                <li><button onClick={() => navigate({ to: "/dashboard/settings" })} className="flex w-full items-center gap-2 px-4 py-2 text-text-primary hover:bg-elevated"><SettingsIcon size={14}/> Preferences</button></li>
                <li><button onClick={() => { setOpenUser(false); setOpenHelp(true); }} className="flex w-full items-center gap-2 px-4 py-2 text-text-primary hover:bg-elevated"><HelpCircle size={14}/> Help <span className="ml-auto rounded border border-soft bg-elevated px-1.5 py-0.5 font-mono text-[9px] text-muted">?</span></button></li>
              </ul>
              <div className="border-t border-soft py-1">
                <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10"><LogOut size={14}/> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <HelpDialog open={openHelp} onClose={() => setOpenHelp(false)} />
    </header>
  );
}
