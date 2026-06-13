import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, User as UserIcon, MapPin, Shield, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/data/users";
import { ROLE_LABELS } from "@/data/users";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Request Access · CrimeIQ Karnataka — SCRB Onboarding" },
      { name: "description", content: "Request analyst, officer, or administrator access to the CrimeIQ Karnataka SCRB intelligence platform." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Request Access · CrimeIQ Karnataka" },
      { property: "og:description", content: "Karnataka State Police SCRB account provisioning portal." },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

const DISTRICTS = ["Bengaluru Urban","Bengaluru Rural","Mysuru","Mangaluru","Hubballi-Dharwad","Belagavi","Kalaburagi","Shivamogga","All Districts"];

function strengthOf(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

function SignupPage() {
  const { signup, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [role, setRole] = useState<Role>("VIEWER");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && isAuthenticated) navigate({ to: "/dashboard" });
  }, [isReady, isAuthenticated, navigate]);

  const strength = strengthOf(password);
  const strengthLabel = ["Too weak","Weak","Fair","Good","Strong"][strength];
  const strengthColor = ["bg-danger","bg-danger","bg-warning","bg-accent","bg-success"][strength];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (strength < 2) { setError("Please choose a stronger password."); return; }
    if (!agree) { setError("You must accept the terms to continue."); return; }
    setLoading(true);
    const res = await signup({ name, email, password, district, role });
    setLoading(false);
    if (!res.ok) { setError(res.error || "Signup failed."); return; }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen flex-col-reverse md:flex-row">
      {/* LEFT */}
      <div className="relative hidden overflow-hidden md:flex md:w-2/5" style={{ background: "linear-gradient(135deg, #0A0D14 0%, #0F1729 50%, #0A0D14 100%)" }}>
        <div className="absolute inset-0 grid-drift opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <Logo size={72} />
          <h1 className="mt-6 font-mono text-2xl font-bold tracking-tight md:text-3xl">Request Access</h1>
          <p className="mt-2 text-sm text-white/60">Onboard to the SCRB Intelligence Platform</p>
          <ul className="mt-10 space-y-3 max-w-sm text-sm">
            {["Role-based access scoped to your jurisdiction","Encrypted at rest and in transit","Audit-logged actions for accountability","Single sign-on with departmental email"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-white/75"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-400"/>{t}</li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-white/40">All new accounts are subject to SCRB administrator approval in production.</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative flex flex-1 items-center justify-center bg-base px-6 py-10">
        <div className="absolute right-4 top-4"><ThemeToggle/></div>
        <Link to="/" className="absolute left-4 top-4 text-xs text-muted hover:text-text-primary">← Back to home</Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="mb-2 md:hidden"><Logo size={48}/></div>
          <h2 className="font-display text-3xl font-bold text-text-primary">Create your account</h2>
          <p className="mt-1 text-sm text-muted">Already have one? <Link to="/login" className="text-accent hover:underline">Sign in</Link></p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
            <Field label="Full Name" icon={UserIcon}>
              <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Anjali Verma" className="w-full bg-transparent text-sm text-text-primary outline-none" />
            </Field>
            <Field label="Official Email" icon={Mail}>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@ksp.gov.in" className="w-full bg-transparent text-sm text-text-primary outline-none" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">District</label>
                <div className="relative">
                  <MapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                  <select value={district} onChange={(e)=>setDistrict(e.target.value)} className="w-full appearance-none rounded-lg border border-soft bg-surface px-8 py-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent)]">
                    {DISTRICTS.map((d)=> <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Role</label>
                <div className="relative">
                  <Shield size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                  <select value={role} onChange={(e)=>setRole(e.target.value as Role)} className="w-full appearance-none rounded-lg border border-soft bg-surface px-8 py-2.5 text-sm text-text-primary outline-none focus:border-[var(--accent)]">
                    {(Object.keys(ROLE_LABELS) as Role[]).map((r)=> <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <Field label="Password" icon={Lock}>
              <input type={showPw?"text":"password"} required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent text-sm text-text-primary outline-none" />
              <button type="button" onClick={()=>setShowPw(v=>!v)} className="text-muted hover:text-text-primary">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </Field>
            {password && (
              <div className="space-y-1">
                <div className="flex h-1.5 gap-1">
                  {[0,1,2,3].map(i=> <div key={i} className={`h-full flex-1 rounded ${i < strength ? strengthColor : "bg-elevated"}`}/>)}
                </div>
                <div className="flex justify-between text-[10px] text-muted"><span>Password strength</span><span className="font-semibold">{strengthLabel}</span></div>
              </div>
            )}
            <Field label="Confirm Password" icon={Lock}>
              <input type={showPw?"text":"password"} required value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Re-enter password" className="w-full bg-transparent text-sm text-text-primary outline-none" />
            </Field>

            <label className="flex items-start gap-2 text-xs text-muted">
              <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="mt-0.5 rounded border-soft"/>
              <span>I agree to the platform's <a className="text-accent hover:underline">Terms of Use</a> and acknowledge unauthorized access is a criminal offense.</span>
            </label>

            {error && <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">{error}</div>}

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin"/>}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-muted">Authorized personnel only. Government of Karnataka · KSP</p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{size?: number; className?: string}>; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-soft bg-surface px-3 py-2.5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/30">
        <Icon size={16} className="text-muted"/>
        {children}
      </div>
    </div>
  );
}