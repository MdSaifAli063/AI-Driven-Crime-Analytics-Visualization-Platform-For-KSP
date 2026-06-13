import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
type AccentColor = "blue" | "purple" | "green" | "red" | "amber" | "cyan";

const ACCENTS: Record<AccentColor, { dark: string; light: string }> = {
  blue:   { dark: "#3B82F6", light: "#2563EB" },
  purple: { dark: "#8B5CF6", light: "#7C3AED" },
  green:  { dark: "#10B981", light: "#059669" },
  red:    { dark: "#EF4444", light: "#DC2626" },
  amber:  { dark: "#F59E0B", light: "#D97706" },
  cyan:   { dark: "#06B6D4", light: "#0891B2" },
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [accent, setAccentState] = useState<AccentColor>("blue");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = (localStorage.getItem("crimeiq-theme") as Theme) || "dark";
    const savedAccent = (localStorage.getItem("crimeiq-accent") as AccentColor) || "blue";
    setThemeState(savedTheme);
    setAccentState(savedAccent);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("crimeiq-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const v = ACCENTS[accent][theme];
    document.documentElement.style.setProperty("--accent", v);
    localStorage.setItem("crimeiq-accent", accent);
  }, [accent, theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    accent,
    setAccent: setAccentState,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useChartColors() {
  const { theme } = useTheme();
  return theme === "dark"
    ? { grid: "#1F2937", axis: "#9CA3AF", tooltipBg: "#111827", tooltipBorder: "rgba(255,255,255,0.1)" }
    : { grid: "#E2E8F0", axis: "#64748B", tooltipBg: "#FFFFFF", tooltipBorder: "rgba(0,0,0,0.1)" };
}

export const CRIME_COLORS: Record<string, string> = {
  Theft: "#3B82F6",
  Assault: "#EF4444",
  Cybercrime: "#8B5CF6",
  Robbery: "#F59E0B",
  Murder: "#DC2626",
  Fraud: "#06B6D4",
  "Drug Offenses": "#10B981",
  Kidnapping: "#EC4899",
};
