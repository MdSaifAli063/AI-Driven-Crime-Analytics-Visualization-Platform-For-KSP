import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, MapPin, Brain, Network } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { MOCK_USERS, ROLE_LABELS } from "@/data/users";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In · CrimeIQ Karnataka — SCRB Intelligence Portal" },
      { name: "description", content: "Secure access portal for Karnataka State Police personnel to the CrimeIQ SCRB intelligence dashboard." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Sign In · CrimeIQ Karnataka" },
      { property: "og:description", content: "Authorized access only. Karnataka State Police SCRB intelligence platform." },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) navigate({ to: "/dashboard" });
  }, [isReady, isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false); setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) { setError(true); return; }
    setFlash(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 300);
  };

  const fillDemo = (idx: number) => {
    setEmail(MOCK_USERS[idx].email);
    setPassword(MOCK_USERS[idx].password);
    setError(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col-reverse md:flex-row">
      {flash && <div className="pointer-events-none fixed inset-0 z-50 bg-accent opacity-30 transition-opacity duration-300" />}

      {/* LEFT */}
      <div className="relative hidden overflow-hidden md:flex md:w-3/5" style={{ background: "linear-gradient(135deg, #0A0D14 0%, #0F1729 50%, #0A0D14 100%)" }}>
        <div className="absolute inset-0 grid-drift opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="relative z-10 flex flex-col justify-center px-14 py-12 text-white">
          <Logo size={84} />
          <h1 className="mt-7 font-mono text-3xl font-bold tracking-tight md:text-4xl">CrimeIQ Karnataka</h1>
          <p className="mt-2 text-sm text-white/60">State Crime Records Bureau · Intelligence Platform</p>
          <div className="mt-12 space-y-4 max-w-md">
            {[
              { icon: MapPin, t: "Geospatial Crime Mapping", d: "Real-time hotspot detection across 8 districts" },
              { icon: Brain, t: "AI-Driven Predictions", d: "ML models forecasting emerging crime typologies" },
              { icon: Network, t: "Network Link Analysis", d: "Uncover hidden criminal association networks" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400"><Icon size={18}/></div>
                <div>
                  <div className="text-sm font-semibold text-white">{t}</div>
                  <div className="text-xs text-white/55">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-xs text-white/40">Government of Karnataka · Karnataka State Police</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative flex flex-1 items-center justify-center bg-base px-6 py-12">
        <div className="absolute right-4 top-4"><ThemeToggle/></div>
        <Link to="/" className="absolute left-4 top-4 text-xs text-muted hover:text-text-primary">← Back to home</Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="mb-2 md:hidden"><Logo size={48}/></div>
          <h2 className="font-display text-3xl font-bold text-text-primary">Welcome Back</h2>
          <p className="mt-1 text-sm text-muted">Sign in to your SCRB account</p>

          <form onSubmit={onSubmit} className={`mt-8 space-y-4 ${error ? "animate-shake" : ""}`}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Official Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ksp.gov.in"
                  className={`w-full rounded-lg border bg-surface px-9 py-2.5 text-sm text-text-primary outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 ${error ? "border-danger" : "border-soft"}`} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className={`w-full rounded-lg border bg-surface px-9 py-2.5 text-sm text-text-primary outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 ${error ? "border-danger" : "border-soft"}`} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            {error && <div className="text-xs text-danger">Invalid credentials. Please try again.</div>}
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" className="rounded border-soft"/>
              Remember this device
            </label>
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin"/>}
              {loading ? "Authenticating…" : "Sign In"}
            </button>
            <p className="text-center text-xs text-muted">New to CrimeIQ? <Link to="/signup" className="font-semibold text-accent hover:underline">Request access</Link></p>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-soft" style={{ background: "var(--border)" }}/>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Quick Access</span>
            <div className="h-px flex-1" style={{ background: "var(--border)" }}/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MOCK_USERS.map((u, i) => (
              <button key={u.id} type="button" onClick={() => fillDemo(i)} className="rounded-lg border border-soft bg-surface px-3 py-2 text-left text-xs transition hover:border-[var(--accent)] hover:bg-elevated">
                <div className="font-semibold text-text-primary">{ROLE_LABELS[u.role]}</div>
                <div className="font-mono text-[10px] text-muted">{u.email.split("@")[0]}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs">
            <button type="button" onClick={() => toast.info("Contact your SCRB administrator to reset credentials.")} className="text-accent hover:underline">Forgot password?</button>
          </div>
          <p className="mt-8 text-center text-[10px] text-muted">Authorized personnel only. Unauthorized access is a criminal offense.</p>
        </motion.div>
      </div>
    </div>
  );
}
