import { useEffect, useRef, useState } from "react";

export function CountUp({ to, duration = 1500, decimals = 0, suffix = "", prefix = "" }: { to: number; duration?: number; decimals?: number; suffix?: string; prefix?: string; }) {
  const [v, setV] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setV(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return <span>{prefix}{formatted}{suffix}</span>;
}