import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { CountUp } from "@/components/CountUp";

export function KpiCard({ label, value, suffix, decimals, delta, accent = "var(--accent)" }: {
  label: string; value: number; suffix?: string; decimals?: number; delta?: number; accent?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-soft bg-surface p-5 transition hover:shadow-[0_0_20px_-5px_var(--accent)]">
      <div className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 font-mono text-3xl font-bold text-text-primary">
        <CountUp to={value} suffix={suffix} decimals={decimals} />
      </div>
      {delta !== undefined && (
        <div className={`mt-1.5 inline-flex items-center gap-1 text-xs ${up ? "text-success" : "text-danger"}`}>
          {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(delta).toFixed(1)}% vs last period
        </div>
      )}
    </div>
  );
}
