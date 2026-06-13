import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/dashboard/Card";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { MOCK_USERS, ROLE_LABELS } from "@/data/users";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ ssr: false, component: SettingsPage });

const TABS = ["General", "Appearance", "Notifications", "Data Sources", "User Management", "Security"] as const;

function SettingsPage() {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const tabs = TABS.filter((t) => t !== "User Management" || user?.role === "SCRB_ADMIN");
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-xs ${tab === t ? "bg-accent text-white" : "border border-soft hover:bg-elevated"}`}>{t}</button>)}
        </div>
      </Card>
      {tab === "General" && (
        <Card title="General">
          <dl className="space-y-3 text-sm">
            <Row label="Platform"><span className="font-mono text-muted">CrimeIQ Karnataka v1.0</span></Row>
            <Row label="Organization">Karnataka State Police</Row>
            <Row label="Timezone">IST (UTC+5:30)</Row>
            <Row label="Language">English</Row>
            <Row label="Refresh Interval"><select className="rounded border border-soft bg-surface px-2 py-1 text-xs"><option>15 min</option><option>30 min</option><option>1 hr</option></select></Row>
          </dl>
        </Card>
      )}
      {tab === "Appearance" && (
        <Card title="Appearance">
          <div className="space-y-5">
            <div><div className="mb-2 text-xs font-semibold uppercase text-muted">Theme</div>
              <div className="flex gap-2">{(["dark", "light"] as const).map((t) => <button key={t} onClick={() => setTheme(t)} className={`rounded-lg border px-4 py-2 text-sm capitalize ${theme === t ? "border-[var(--accent)] bg-accent/10 text-accent" : "border-soft"}`}>{t}</button>)}</div>
            </div>
            <div><div className="mb-2 text-xs font-semibold uppercase text-muted">Accent Color</div>
              <div className="flex flex-wrap gap-2">
                {(["blue","purple","green","red","amber","cyan"] as const).map((a) => {
                  const swatch = { blue: "#3B82F6", purple: "#8B5CF6", green: "#10B981", red: "#EF4444", amber: "#F59E0B", cyan: "#06B6D4" }[a];
                  return <button key={a} onClick={() => setAccent(a)} className={`h-9 w-9 rounded-lg ring-2 ${accent === a ? "ring-text-primary" : "ring-transparent"}`} style={{ background: swatch }} title={a}/>;
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
      {tab === "Notifications" && (
        <Card title="Notifications">
          <div className="space-y-2 text-sm">
            {["Email Alerts","Critical Alerts","Spike Detection","New Anomalies","Weekly Digest","System Updates"].map((n) => (
              <label key={n} className="flex items-center justify-between rounded-lg border border-soft px-3 py-2"><span>{n}</span><input type="checkbox" defaultChecked className="rounded"/></label>
            ))}
          </div>
        </Card>
      )}
      {tab === "Data Sources" && (
        <Card title="Data Sources">
          <div className="grid gap-3 md:grid-cols-3">
            {["Karnataka Crime Database","NCRB Integration","SCRB Reports"].map((s) => (
              <div key={s} className="rounded-lg border border-soft p-4">
                <div className="text-sm font-semibold text-text-primary">{s}</div>
                <div className="mt-1 text-[11px] text-muted">Last sync: 12 min ago</div>
                <div className="mt-2 inline-block rounded bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">ACTIVE</div>
                <button onClick={() => { toast.info("Syncing..."); setTimeout(() => toast.success("Synced just now"), 1500); }} className="mt-3 w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">Sync Now</button>
              </div>
            ))}
          </div>
        </Card>
      )}
      {tab === "User Management" && user?.role === "SCRB_ADMIN" && (
        <Card title="User Management" action={<button onClick={() => toast.success("Invite sent")} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">+ Invite User</button>}>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-soft text-left text-muted"><th className="py-2">Name</th><th>Role</th><th>District</th><th>Status</th></tr></thead>
            <tbody>{MOCK_USERS.map((u) => <tr key={u.id} className="border-b border-soft"><td className="py-2 font-medium text-text-primary">{u.name}<div className="text-[10px] text-muted">{u.email}</div></td><td>{ROLE_LABELS[u.role]}</td><td>{u.district}</td><td><span className="rounded bg-success/15 px-1.5 py-0.5 text-success font-bold">ACTIVE</span></td></tr>)}</tbody>
          </table>
        </Card>
      )}
      {tab === "Security" && (
        <Card title="Security">
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-soft p-3"><div className="font-semibold">Active Sessions</div><div className="text-[11px] text-muted">Chrome on Windows · Bengaluru · Active now</div></div>
            <div className="flex items-center justify-between rounded-lg border border-soft p-3"><div><div className="font-semibold">Two-Factor Authentication</div><div className="text-[11px] text-muted">Add an extra layer of security</div></div><button onClick={() => toast.info("Contact administrator to configure 2FA")} className="rounded-lg border border-soft px-3 py-1 text-xs">Enable</button></div>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between rounded-lg border border-soft px-3 py-2"><dt className="text-muted">{label}</dt><dd>{children}</dd></div>;
}
