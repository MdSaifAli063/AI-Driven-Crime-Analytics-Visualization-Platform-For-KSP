import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ChevronLeft, ChevronRight, MapPin, Brain, Network, Bell, BarChart3, ShieldCheck } from "lucide-react";

const SLIDES = [
  {
    icon: MapPin,
    title: "Geospatial Hotspot Map",
    body: "Live heatmaps across all 8 Karnataka districts with severity overlays, beat boundaries, and historical incident clustering.",
    accent: "from-cyan-500/30 to-blue-500/10",
  },
  {
    icon: Brain,
    title: "AI Predictive Intelligence",
    body: "Forecast incident likelihood by district, crime type, and 6-hour window — surfaced as ranked, explainable predictions.",
    accent: "from-violet-500/30 to-fuchsia-500/10",
  },
  {
    icon: Network,
    title: "Criminal Network Analysis",
    body: "Graph-based link analysis maps offender associations, co-arrest patterns, and cross-jurisdictional connections.",
    accent: "from-amber-500/25 to-rose-500/10",
  },
  {
    icon: Bell,
    title: "Realtime Anomaly Alerts",
    body: "Push notifications the moment a statistical anomaly is detected — with severity, location, and recommended action.",
    accent: "from-rose-500/30 to-red-500/10",
  },
  {
    icon: BarChart3,
    title: "Trend Analytics & Reports",
    body: "Multi-dimensional dashboards, exportable PDF/CSV reports, and scheduled digests for command briefings.",
    accent: "from-emerald-500/30 to-teal-500/10",
  },
];

const AUTOPLAY_MS = 4200;

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!open) return;
    setI(0); setPlaying(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((p) => (p + 1) % SLIDES.length);
      if (e.key === "ArrowLeft") setI((p) => (p - 1 + SLIDES.length) % SLIDES.length);
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(() => setI((p) => (p + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [i, open, playing]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-soft bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-soft bg-elevated/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent"><ShieldCheck size={13}/></span>
                <div className="text-xs font-semibold uppercase tracking-wider text-text-primary">CrimeIQ · Product Tour</div>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-soft bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">{i + 1} / {SLIDES.length}</span>
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-elevated hover:text-text-primary"><X size={16}/></button>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden bg-base">
              <AnimatePresence mode="wait">
                {SLIDES.map((s, idx) => idx === i && (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${s.accent} p-8 text-center`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
                      backgroundImage:
                        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }} />
                    <motion.div
                      initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                      className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-soft bg-surface/70 text-accent backdrop-blur"
                    >
                      <s.icon size={28}/>
                    </motion.div>
                    <motion.h3
                      initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}
                      className="font-display text-2xl font-bold text-text-primary sm:text-3xl"
                    >{s.title}</motion.h3>
                    <motion.p
                      initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.26 }}
                      className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base"
                    >{s.body}</motion.p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {playing && (
                <motion.div
                  key={`bar-${i}`}
                  initial={{ width: 0 }} animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-accent"
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-soft bg-elevated/30 px-5 py-3">
              <button onClick={() => setPlaying((p) => !p)} className="inline-flex items-center gap-1.5 rounded-md border border-soft bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-elevated">
                {playing ? <><Pause size={12}/> Pause</> : <><Play size={12}/> Play</>}
              </button>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, idx) => (
                  <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-accent" : "w-1.5 bg-soft hover:bg-muted"}`} />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setI((p) => (p - 1 + SLIDES.length) % SLIDES.length)} className="rounded-md border border-soft bg-surface p-1.5 text-text-primary hover:bg-elevated"><ChevronLeft size={14}/></button>
                <button onClick={() => setI((p) => (p + 1) % SLIDES.length)} className="rounded-md border border-soft bg-surface p-1.5 text-text-primary hover:bg-elevated"><ChevronRight size={14}/></button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}