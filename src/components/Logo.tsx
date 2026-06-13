export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-label="CrimeIQ Karnataka">
      <defs>
        <linearGradient id="kspGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--purple)" />
        </linearGradient>
      </defs>
      <path d="M32 3 L57 14 V32 C57 47 45 57 32 61 C19 57 7 47 7 32 V14 Z" fill="url(#kspGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M32 12 L36.5 25.5 H50 L39 33.5 L43.5 47 L32 39.5 L20.5 47 L25 33.5 L14 25.5 H27.5 Z" fill="white" fillOpacity="0.95" />
      <text x="32" y="58" fontSize="6" fontWeight="700" textAnchor="middle" fill="white" fontFamily="JetBrains Mono">KSP</text>
    </svg>
  );
}