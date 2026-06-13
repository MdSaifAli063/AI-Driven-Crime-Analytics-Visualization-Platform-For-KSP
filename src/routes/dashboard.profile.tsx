import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Mail, MapPin, Shield, Calendar, Pencil, Save, X, LogOut, KeyRound, BadgeCheck, Activity, Camera, Trash2 } from "lucide-react";
import { Card } from "@/components/dashboard/Card";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/data/users";
import { relTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({ ssr: false, component: ProfilePage });

const DISTRICTS = ["Bengaluru Urban","Bengaluru Rural","Mysuru","Mangaluru","Hubballi-Dharwad","Belagavi","Kalaburagi","Shivamogga","All Districts"];

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [district, setDistrict] = useState(user?.district || DISTRICTS[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const activity = useMemo(() => [
    { t: "Signed in to platform", time: user?.lastLogin || new Date().toISOString() },
    { t: "Exported Trend Analytics report (PDF)", time: new Date(Date.now() - 3600e3 * 6).toISOString() },
    { t: "Resolved anomaly alert · Bengaluru Urban", time: new Date(Date.now() - 3600e3 * 22).toISOString() },
    { t: "Updated notification preferences", time: new Date(Date.now() - 86400e3 * 2).toISOString() },
    { t: "Reviewed offender profile #KA-3421", time: new Date(Date.now() - 86400e3 * 4).toISOString() },
  ], [user?.lastLogin]);

  if (!user) return null;

  const onPickPhoto = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: String(reader.result) });
      toast.success("Profile photo updated");
    };
    reader.onerror = () => toast.error("Could not read image");
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updateProfile({ avatarUrl: undefined });
    toast.success("Profile photo removed");
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Name cannot be empty"); return; }
    const avatar = trimmed.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
    updateProfile({ name: trimmed, district, avatar });
    setEditing(false);
    toast.success("Profile updated");
  };

  const cancel = () => {
    setName(user.name); setDistrict(user.district); setEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border border-soft bg-surface">
        <div className="h-28 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative -mt-10">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-2xl border-4 border-surface object-cover shadow-lg" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface bg-accent text-2xl font-bold text-white shadow-lg">
                  {user.avatar}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                title="Change photo"
                className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-accent text-white shadow-md transition hover:opacity-90"
              >
                <Camera size={13} />
              </button>
              {user.avatarUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-danger text-white shadow-md transition hover:opacity-90"
                >
                  <Trash2 size={11} />
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPickPhoto(f);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-text-primary">{user.name}</h1>
                <BadgeCheck size={16} className="text-accent" />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded bg-accent/15 px-2 py-0.5 font-bold uppercase tracking-wider text-accent">{ROLE_LABELS[user.role]}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={11}/> {user.district}</span>
                <span className="inline-flex items-center gap-1"><Mail size={11}/> {user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:opacity-90"><Pencil size={13}/> Edit Profile</button>
            ) : (
              <>
                <button onClick={save} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:opacity-90"><Save size={13}/> Save</button>
                <button onClick={cancel} className="inline-flex items-center gap-1.5 rounded-lg border border-soft bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:bg-elevated"><X size={13}/> Cancel</button>
              </>
            )}
            <button onClick={() => { logout(); navigate({ to: "/login" }); }} className="inline-flex items-center gap-1.5 rounded-lg border border-soft bg-surface px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10"><LogOut size={13}/> Sign Out</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Account Details" className="md:col-span-2">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Field label="Full Name" icon={<BadgeCheck size={13}/>}>
              {editing ? (
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md border border-soft bg-base px-2 py-1.5 text-sm text-text-primary outline-none focus:border-[var(--accent)]"/>
              ) : <span className="text-sm text-text-primary">{user.name}</span>}
            </Field>
            <Field label="Email" icon={<Mail size={13}/>}>
              <span className="text-sm text-text-primary">{user.email}</span>
            </Field>
            <Field label="Role" icon={<Shield size={13}/>}>
              <span className="text-sm text-text-primary">{ROLE_LABELS[user.role]}</span>
            </Field>
            <Field label="Jurisdiction" icon={<MapPin size={13}/>}>
              {editing ? (
                <select value={district} onChange={(e)=>setDistrict(e.target.value)} className="w-full rounded-md border border-soft bg-base px-2 py-1.5 text-sm text-text-primary outline-none focus:border-[var(--accent)]">
                  {DISTRICTS.map((d)=> <option key={d}>{d}</option>)}
                </select>
              ) : <span className="text-sm text-text-primary">{user.district}</span>}
            </Field>
            <Field label="User ID" icon={<BadgeCheck size={13}/>}>
              <span className="font-mono text-xs text-muted">{user.id}</span>
            </Field>
            <Field label="Last Login" icon={<Calendar size={13}/>}>
              <span className="text-sm text-text-primary">{user.lastLogin ? relTime(user.lastLogin) : "—"}</span>
            </Field>
          </dl>

          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Permissions</div>
            <div className="flex flex-wrap gap-1.5">
              {user.permissions.map((p) => (
                <span key={p} className="rounded-md border border-soft bg-elevated px-2 py-1 font-mono text-[10px] text-text-primary">{p}</span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Security">
          <div className="space-y-3 text-sm">
            <button onClick={()=>toast.info("Password reset link sent to your email")} className="flex w-full items-center justify-between rounded-lg border border-soft px-3 py-2.5 text-left transition hover:bg-elevated">
              <span className="flex items-center gap-2"><KeyRound size={14}/> Change Password</span>
              <span className="text-xs text-muted">›</span>
            </button>
            <div className="flex items-center justify-between rounded-lg border border-soft px-3 py-2.5">
              <div>
                <div className="text-sm font-medium text-text-primary">Two-Factor Auth</div>
                <div className="text-[11px] text-muted">Not enabled</div>
              </div>
              <button onClick={()=>toast.info("Contact your SCRB administrator to enable 2FA")} className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">Enable</button>
            </div>
            <div className="rounded-lg border border-soft px-3 py-2.5">
              <div className="text-sm font-medium text-text-primary">Active Session</div>
              <div className="text-[11px] text-muted">Chrome · Karnataka · Active now</div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Activity" action={<Activity size={14} className="text-muted"/>}>
        <ul className="divide-y divide-soft">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-text-primary">{a.t}</span>
              <span className="text-[11px] text-muted">{relTime(a.time)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-soft bg-base/40 px-3 py-2.5">
      <dt className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{icon}{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}