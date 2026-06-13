import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, MapPin, Brain, Network, Users, Bell, ChevronDown,
  Play, ArrowRight, Crown, BarChart3, Eye, BadgeCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParticleCanvas } from "@/components/landing/ParticleCanvas";
import { CountUp } from "@/components/CountUp";
import { DemoModal } from "@/components/landing/DemoModal";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "CrimeIQ Karnataka — SCRB Intelligence Platform" },
      { name: "description", content: "From reactive policing to proactive intelligence. Geospatial analytics, AI prediction, and network analysis for Karnataka's 8 districts." },
      { name: "keywords", content: "Karnataka police, SCRB, crime analytics, predictive policing, hotspot mapping, criminal network analysis, KSP" },
      { property: "og:title", content: "CrimeIQ Karnataka" },
      { property: "og:description", content: "AI-driven crime analytics platform for the Karnataka State Police SCRB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        name: "CrimeIQ Karnataka — SCRB",
        alternateName: "Karnataka State Crime Records Bureau Intelligence Platform",
        url: "/",
        parentOrganization: { "@type": "GovernmentOrganization", name: "Karnataka State Police" },
        areaServed: { "@type": "State", name: "Karnataka, India" },
        description: "AI-driven crime analytics, geospatial hotspot mapping, and network intelligence for the Karnataka State Police SCRB.",
      }),
    }],
  }),
  component: Landing,
});

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "glass shadow-lg" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div className="font-mono text-sm font-bold text-text-primary sm:text-base">CrimeIQ Karnataka</div>
        </div>
        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href="#features" className="transition hover:text-text-primary">Features</a>
          <a href="#capabilities" className="transition hover:text-text-primary">Capabilities</a>
          <a href="#access" className="transition hover:text-text-primary">Access Levels</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-md transition hover:opacity-90">
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section className="aurora-bg relative flex min-h-screen items-center justify-center overflow-hidden bg-base pt-24 pb-16">
      <ParticleCanvas className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 grid-drift opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-6"
      >
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-soft glass px-3.5 py-1.5 text-[11px] font-medium text-muted sm:text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <ShieldCheck size={13} className="text-accent" />
          <span className="hidden sm:inline">Karnataka State Police · SCRB Intelligence Division</span>
          <span className="sm:hidden">KSP · SCRB Intelligence</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-balance font-sans text-[2rem] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          From Reactive Policing to{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--purple)] to-[var(--accent)] bg-[length:200%_auto] bg-clip-text text-transparent [animation:aurora-drift_8s_linear_infinite]">
            Proactive Intelligence
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">
          CrimeIQ transforms fragmented crime records into actionable intelligence — combining geospatial analytics, AI prediction, and network analysis for Karnataka's 8 districts.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--purple)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] sm:w-auto"
          >
            <ShieldCheck size={16} /> Access Platform
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => setDemoOpen(true)}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-soft glass px-7 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-elevated sm:w-auto"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent transition group-hover:bg-accent group-hover:text-white">
              <Play size={11} />
            </span>
            Watch Demo
          </button>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted sm:text-xs">
          <span className="inline-flex items-center gap-1.5"><BadgeCheck size={13} className="text-success" /> Government Authorized</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-accent" /> End-to-End Encrypted</span>
          <span className="inline-flex items-center gap-1.5"><Eye size={13} className="text-purple" /> Audit Logged</span>
        </div>
      </motion.div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-muted">
        <ChevronDown size={22} />
      </div>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}

function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const stats = [
    { v: 12847, label: "Incidents Analyzed", suffix: "+" },
    { v: 8, label: "Districts Covered", suffix: "" },
    { v: 89, label: "Offenders Flagged", suffix: "" },
    { v: 67.3, label: "Resolution Rate", suffix: "%", decimals: 1 },
  ];
  return (
    <section ref={ref} className="border-y border-soft bg-[#0A0D14] py-12 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`text-center ${i > 0 ? "md:border-l md:border-white/10" : ""}`}>
            <div className="font-mono text-3xl font-bold text-white sm:text-4xl">
              {visible && <CountUp to={s.v} suffix={s.suffix} decimals={s.decimals || 0} />}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/60 sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CapabilityBlock({ visual, title, kicker, bullets, reverse }: { visual: React.ReactNode; title: string; kicker: string; bullets: string[]; reverse?: boolean; }) {
  return (
    <div className={`grid items-center gap-12 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div>{visual}</div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-accent">{kicker}</div>
        <h3 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl">{title}</h3>
        <ul className="mt-6 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-muted">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MapVisual() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-soft bg-surface p-6 shadow-xl">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <defs>
          <radialGradient id="hg1"><stop offset="0%" stopColor="#EF4444" stopOpacity="0.7"/><stop offset="100%" stopColor="#EF4444" stopOpacity="0"/></radialGradient>
          <radialGradient id="hg2"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="400" height="300" fill="var(--bg-elevated)" />
        <path d="M50 80 L120 50 L200 70 L280 60 L350 100 L340 200 L280 250 L180 260 L80 230 L40 160 Z" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="150" cy="130" r="55" fill="url(#hg1)" />
        <circle cx="260" cy="180" r="45" fill="url(#hg2)" />
        <circle cx="100" cy="200" r="35" fill="url(#hg2)" />
        {[[150,130],[260,180],[100,200],[200,90],[300,140]].map(([x,y], i) => (
          <g key={i}><circle cx={x} cy={y} r="5" fill="#EF4444"/><circle cx={x} cy={y} r="10" fill="none" stroke="#EF4444" strokeOpacity="0.4" className="animate-pulse-ring" style={{transformOrigin: `${x}px ${y}px`}}/></g>
        ))}
      </svg>
    </div>
  );
}
function ChartVisual() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-soft bg-surface p-6 shadow-xl">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect width="400" height="300" fill="var(--bg-elevated)" />
        {[50,90,130,170,210,250].map((y) => <line key={y} x1="40" x2="380" y1={y} y2={y} stroke="var(--border)"/>)}
        {[60,80,50,90,120,100,140].map((h, i) => (
          <rect key={i} x={50 + i * 40} y={250 - h} width="24" height={h} fill="var(--accent)" rx="3" opacity="0.85"/>
        ))}
        <path d="M50 130 Q150 110 220 95 T380 50" fill="none" stroke="var(--purple)" strokeWidth="2.5" strokeDasharray="6 4"/>
        <path d="M220 95 Q300 85 380 50 L380 90 Q300 120 220 130 Z" fill="var(--purple)" fillOpacity="0.18"/>
        <circle cx="380" cy="50" r="5" fill="var(--purple)"/>
      </svg>
    </div>
  );
}
function NetworkVisual() {
  const nodes = [[200,150],[120,80],[280,80],[80,180],[320,180],[150,240],[260,240],[100,120],[300,120],[200,60],[200,250],[60,150],[340,150],[180,180],[230,110]];
  const colors = ["#EF4444","#3B82F6","#3B82F6","#F59E0B","#8B5CF6","#EF4444","#3B82F6","#F59E0B","#3B82F6","#8B5CF6","#EF4444","#3B82F6","#F59E0B","#3B82F6","#EF4444"];
  const edges = [[0,1],[0,2],[0,13],[0,14],[1,3],[1,7],[1,9],[2,4],[2,8],[3,5],[4,6],[5,10],[6,10],[7,11],[8,12],[1,2],[13,5],[14,4]];
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-soft bg-surface p-6 shadow-xl">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect width="400" height="300" fill="var(--bg-elevated)" />
        {edges.map(([a,b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="var(--accent)" strokeOpacity="0.35"/>)}
        {nodes.map(([x,y], i) => <circle key={i} cx={x} cy={y} r="8" fill={colors[i]} stroke="var(--bg-surface)" strokeWidth="2"/>)}
      </svg>
    </div>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="bg-base px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-28">
        <CapabilityBlock kicker="GEOSPATIAL" title="See Crime Where It Happens" visual={<MapVisual />} bullets={["District-level drill-down with cluster mapping","Spatiotemporal hotspot detection in real-time","AI-predicted risk zones with confidence overlays"]} />
        <CapabilityBlock reverse kicker="PREDICTIVE" title="Predict Before It Happens" visual={<ChartVisual />} bullets={["ML risk scoring across 8 districts and 8 crime types","90-day forecasting with confidence interval bands","Socio-economic correlation analysis"]} />
        <CapabilityBlock kicker="LINK ANALYSIS" title="Uncover Hidden Networks" visual={<NetworkVisual />} bullets={["Criminal association mapping at 2nd-degree depth","Repeat offender MO tracking and cluster discovery","Cross-jurisdiction connection alerts"]} />
      </div>
    </section>
  );
}

function PlatformOverview() {
  const items = [
    { icon: MapPin, title: "Geospatial Hotspot Mapping", desc: "Heatmaps, clusters, and pulsing spike rings across Karnataka" },
    { icon: Network, title: "Criminal Network Analysis", desc: "Force-directed link graphs revealing offender associations" },
    { icon: BarChart3, title: "Temporal Trend Analytics", desc: "Calendar heatmaps, polar hour patterns, correlation matrices" },
    { icon: Brain, title: "AI Predictive Intelligence", desc: "Risk gauges, 90-day forecasts, hotspot prediction tables" },
    { icon: Users, title: "Offender Profile Management", desc: "MO tracking, risk scores, network mini-maps per offender" },
    { icon: Bell, title: "Real-Time Anomaly Alerts", desc: "Spike detection, cluster forming, MO match notifications" },
  ];
  return (
    <section id="features" className="border-y border-soft bg-elevated px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-5xl">Everything Your Analysts Need</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Six integrated intelligence modules, one unified dashboard.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-2xl border border-soft bg-surface p-6 transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_0_30px_-5px_var(--accent)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition group-hover:scale-110"><Icon size={22}/></div>
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessLevels() {
  const roles = [
    { icon: Crown, name: "SCRB Administrator", desc: "Full platform · all districts · user management", tags: ["All Data","Manage Users","Export"] },
    { icon: BarChart3, name: "District Analyst", desc: "Deep analytics for assigned district", tags: ["District Data","AI Predictions","Export"] },
    { icon: BadgeCheck, name: "Field Officer", desc: "Operational map, alerts, incident updates", tags: ["Map View","Alerts","District Data"] },
    { icon: Eye, name: "Viewer", desc: "Read-only intelligence briefings", tags: ["Read-Only","Overview","Trends"] },
  ];
  return (
    <section id="access" className="bg-base px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-5xl">Designed for Every Level of the Force</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Role-based access ensures the right intelligence reaches the right people.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {roles.map(({ icon: Icon, name, desc, tags }) => (
            <div key={name} className="rounded-2xl border border-soft bg-surface p-6 transition hover:border-[var(--accent)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon size={22}/></div>
              <h3 className="text-base font-semibold text-text-primary">{name}</h3>
              <p className="mt-1 text-xs text-muted">{desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((t) => <span key={t} className="rounded-full bg-elevated px-2.5 py-0.5 text-[10px] font-medium text-muted">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechBand() {
  const items = ["React", "Leaflet Maps", "AI/ML Models", "Force Graph", "Real-time Analytics", "Secure Auth"];
  return (
    <section className="border-y border-soft bg-[#0A0D14] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Built on Modern Intelligence Infrastructure</div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-7">
          {items.map((i) => <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80">{i}</div>)}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-base px-6 py-24">
      <div className="mx-auto max-w-3xl rounded-3xl border border-soft glass p-12 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Ready to Transform Crime Intelligence in Karnataka?</h2>
        <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:scale-[1.02] active:scale-95">
          Access CrimeIQ Platform <ArrowRight size={18}/>
        </Link>
        <p className="mt-5 text-xs text-muted">Authorized personnel only · Karnataka State Police · SCRB</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-soft bg-surface px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2"><Logo size={28}/><div className="font-mono text-sm font-bold text-text-primary">CrimeIQ Karnataka</div></div>
          <p className="mt-3 text-xs text-muted">Intelligence platform for the Karnataka State Crime Records Bureau.</p>
          <p className="mt-3 text-xs text-muted">© 2025 Karnataka State Police</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-primary">Platform</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">
            <li><a href="#features" className="hover:text-text-primary">Features</a></li>
            <li><a href="#capabilities" className="hover:text-text-primary">Capabilities</a></li>
            <li><a href="#" className="hover:text-text-primary">Demo</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-primary">Legal</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">
            <li><a href="#" className="hover:text-text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-text-primary">Terms of Use</a></li>
            <li><a href="#" className="hover:text-text-primary">Data Security</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-primary">Contact</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted">
            <li>SCRB Division</li>
            <li>scrb@ksp.gov.in</li>
            <li>Bengaluru, Karnataka</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-soft pt-6 text-center text-xs text-muted">
        This platform contains sensitive law enforcement data. Unauthorized access is prohibited.
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="min-h-screen bg-base">
      <NavBar />
      <Hero />
      <StatsBar />
      <Capabilities />
      <PlatformOverview />
      <AccessLevels />
      <TechBand />
      <FinalCTA />
      <Footer />
    </main>
  );
}
