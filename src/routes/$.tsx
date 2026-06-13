import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({ ssr: false, component: NotFound });

function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-6">
      <svg viewBox="-200 -200 400 400" className="pointer-events-none absolute inset-0 m-auto h-[600px] w-[600px] opacity-30">
        <circle r="180" fill="none" stroke="var(--accent)" strokeOpacity="0.3"/>
        <circle r="120" fill="none" stroke="var(--accent)" strokeOpacity="0.2"/>
        <circle r="60" fill="none" stroke="var(--accent)" strokeOpacity="0.15"/>
        <g className="animate-radar"><path d="M0 0 L180 0 A180 180 0 0 0 156 -90 Z" fill="var(--accent)" fillOpacity="0.25"/></g>
      </svg>
      <div className="relative z-10 text-center">
        <div className="font-mono text-7xl font-bold text-text-primary animate-glitch md:text-9xl">404</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-text-primary">Page Not Found</h1>
        <p className="mt-2 max-w-md text-sm text-muted">The intelligence record you're looking for doesn't exist in our database.</p>
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white">← Return to Dashboard</Link>
      </div>
    </div>
  );
}
