import { useEffect, useState } from "react";
import { X, LifeBuoy, Keyboard, BookOpen, MessageSquare, Mail, ExternalLink, Search, ChevronDown, Send } from "lucide-react";
import { toast } from "sonner";

const FAQS = [
  { q: "How do I investigate an anomaly alert?", a: "Open the bell icon or the Anomaly Alerts page. Click any alert to mark it read, then use the Investigate link to view related incidents on the Hotspot Map." },
  { q: "Why don't I see Network Analysis or AI Predictions?", a: "These modules require elevated permissions. Ask an SCRB admin to grant `network_analysis` or `ai_predictions` to your role." },
  { q: "How does the live feed work?", a: "The dashboard subscribes to a realtime signal stream. New incidents stream in automatically every 18–32 seconds while the tab is active. Use the Simulate button to test." },
  { q: "How do I change my district or display name?", a: "Open the avatar menu → My Profile → Account Details, then click Edit." },
  { q: "How do I clear all notifications?", a: "Click the bell icon and choose Clear, or open Anomaly Alerts and use Clear all." },
  { q: "Is my data secure?", a: "All sessions are end-to-end encrypted. PII is masked in non-admin views per SCRB data-handling policy." },
];

const SHORTCUTS: Array<[string, string]> = [
  ["⌘ K  /  Ctrl K", "Open global search"],
  ["G then O", "Go to Overview"],
  ["G then M", "Go to Hotspot Map"],
  ["G then A", "Go to Anomaly Alerts"],
  ["?", "Open this help dialog"],
  ["Esc", "Close dialogs / popovers"],
];

type Tab = "faq" | "shortcuts" | "contact";

export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("faq");
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const filtered = FAQS.filter(
    (f) => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) { toast.error("Please add a subject and message"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    const ticket = `HD-${Date.now().toString().slice(-6)}`;
    toast.success(`Ticket ${ticket} created`, { description: "Our support team will reply within 24h." });
    setSubject(""); setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <button onClick={onClose} aria-label="Close help" className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-soft bg-surface shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between gap-3 border-b border-soft bg-gradient-to-r from-accent/10 via-purple/10 to-transparent px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><LifeBuoy size={18}/></div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-text-primary">Help & Support</div>
              <div className="truncate text-[11px] text-muted">CrimeIQ KSP · SCRB Help Desk</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted transition hover:bg-elevated hover:text-text-primary" aria-label="Close"><X size={16}/></button>
        </div>

        <div className="flex gap-1 border-b border-soft px-2 py-2 sm:px-3">
          {([
            ["faq", BookOpen, "FAQ"],
            ["shortcuts", Keyboard, "Shortcuts"],
            ["contact", MessageSquare, "Contact"],
          ] as const).map(([k, Icon, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-initial ${tab===k?"bg-accent/15 text-accent":"text-text-primary hover:bg-elevated"}`}>
              <Icon size={13}/> <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label}</span>
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-auto p-4 sm:p-5">
          {tab === "faq" && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles…"
                  className="w-full rounded-lg border border-soft bg-elevated py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition focus:border-accent"/>
              </div>
              <ul className="space-y-2">
                {filtered.length === 0 && (
                  <li className="rounded-lg border border-dashed border-soft p-4 text-center text-xs text-muted">No articles match "{query}". Try the Contact tab.</li>
                )}
                {filtered.map((f, i) => {
                  const isOpen = openIdx === i;
                  return (
                    <li key={f.q} className="overflow-hidden rounded-lg border border-soft bg-elevated/40">
                      <button onClick={() => setOpenIdx(isOpen ? null : i)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-elevated">
                        <span className="text-xs font-semibold text-text-primary">{f.q}</span>
                        <ChevronDown size={14} className={`shrink-0 text-muted transition-transform ${isOpen?"rotate-180":""}`}/>
                      </button>
                      {isOpen && <div className="border-t border-soft px-3 py-2.5 text-xs leading-relaxed text-muted">{f.a}</div>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {tab === "shortcuts" && (
            <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-soft">
              {SHORTCUTS.map(([key, desc]) => (
                <li key={key} className="flex items-center justify-between gap-3 bg-elevated/30 px-3 py-2.5">
                  <span className="text-xs text-text-primary">{desc}</span>
                  <kbd className="rounded-md border border-soft bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold text-text-primary shadow-sm">{key}</kbd>
                </li>
              ))}
            </ul>
          )}

          {tab === "contact" && (
            <form onSubmit={submit} className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <a href="mailto:helpdesk@ksp.gov.in" className="group flex items-center gap-2.5 rounded-lg border border-soft bg-elevated/40 p-3 transition hover:border-accent hover:bg-accent/5">
                  <Mail size={16} className="text-accent"/>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Email</div>
                    <div className="truncate text-xs font-semibold text-text-primary">helpdesk@ksp.gov.in</div>
                  </div>
                </a>
                <a href="https://docs.ksp.gov.in/crimeiq" target="_blank" rel="noreferrer" className="group flex items-center gap-2.5 rounded-lg border border-soft bg-elevated/40 p-3 transition hover:border-accent hover:bg-accent/5">
                  <ExternalLink size={16} className="text-accent"/>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Docs</div>
                    <div className="truncate text-xs font-semibold text-text-primary">Open documentation</div>
                  </div>
                </a>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Briefly describe the issue"
                  className="w-full rounded-lg border border-soft bg-elevated px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent"/>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Steps to reproduce, what you expected, what happened…"
                  className="w-full resize-none rounded-lg border border-soft bg-elevated px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent"/>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted">Typical response time: under 24h</span>
                <button type="submit" disabled={sending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-accent/30 transition hover:opacity-90 disabled:opacity-50">
                  <Send size={12}/> {sending ? "Sending…" : "Submit ticket"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}