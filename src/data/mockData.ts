// Synthetic Karnataka crime data for CrimeIQ.

export const DISTRICTS = [
  { name: "Bengaluru Urban", lat: 12.9716, lng: 77.5946, population: 9621551 },
  { name: "Mysuru",          lat: 12.2958, lng: 76.6394, population: 3001127 },
  { name: "Hubli-Dharwad",   lat: 15.3647, lng: 75.1240, population: 1846993 },
  { name: "Mangaluru",       lat: 12.9141, lng: 74.8560, population: 2089649 },
  { name: "Belagavi",        lat: 15.8497, lng: 74.4977, population: 4779661 },
  { name: "Kalaburagi",      lat: 17.3297, lng: 76.8343, population: 2566326 },
  { name: "Shivamogga",      lat: 13.9299, lng: 75.5681, population: 1752753 },
  { name: "Tumakuru",        lat: 13.3409, lng: 77.1010, population: 2681449 },
] as const;

export type DistrictName = (typeof DISTRICTS)[number]["name"];

export const CRIME_TYPES = [
  "Theft", "Assault", "Cybercrime", "Robbery",
  "Murder", "Fraud", "Drug Offenses", "Kidnapping",
] as const;
export type CrimeType = (typeof CRIME_TYPES)[number];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const between = (a: number, b: number) => a + rand() * (b - a);
const intBetween = (a: number, b: number) => Math.floor(between(a, b + 1));

const STATIONS = ["Central PS", "South PS", "North PS", "East PS", "West PS", "Cyber Cell", "Traffic PS", "Mahila PS", "Rural PS", "Cantonment PS"];

export interface Incident {
  id: string; date: string; district: DistrictName; policeStation: string;
  crimeType: CrimeType; lat: number; lng: number;
  offenderId?: string; victimId?: string;
  status: "open" | "solved" | "pending"; severity: number; resolved: boolean;
}
const startDate = new Date("2022-01-01").getTime();
const endDate   = new Date("2025-06-30").getTime();
export const incidents: Incident[] = Array.from({ length: 120 }, (_, i) => {
  const district = pick(DISTRICTS);
  const crimeType = pick(CRIME_TYPES);
  const status = pick(["open", "solved", "pending"] as const);
  return {
    id: `INC-${String(1000 + i)}`,
    date: new Date(startDate + rand() * (endDate - startDate)).toISOString(),
    district: district.name,
    policeStation: `${district.name} ${pick(STATIONS)}`,
    crimeType,
    lat: district.lat + (rand() - 0.5) * 0.3,
    lng: district.lng + (rand() - 0.5) * 0.3,
    offenderId: rand() < 0.7 ? `OFF-${intBetween(1, 30).toString().padStart(3, "0")}` : undefined,
    status,
    severity: intBetween(1, 5),
    resolved: status === "solved",
  };
});

const FIRST = ["Arjun", "Vikram", "Ravi", "Karthik", "Suresh", "Manjunath", "Prakash", "Ramesh", "Anil", "Naveen", "Mahesh", "Ganesh", "Dinesh", "Lokesh", "Harish"];
const LAST  = ["Gowda", "Hegde", "Shetty", "Rao", "Nayak", "Bhat", "Kamath", "Pai", "Naik", "Shenoy", "Acharya", "Murthy", "Reddy", "Patil", "Desai"];
const MO_POOL = ["Break-&-Enter", "Pickpocketing", "Vehicle Theft", "Gang Activity", "Phishing", "Identity Theft", "Armed Robbery", "Domestic Violence", "Cyber Stalking", "Drug Trafficking", "Money Laundering", "Extortion"];

export interface Offender {
  id: string; name: string; age: number; gender: "M" | "F";
  district: DistrictName; primaryMO: string; moTags: string[];
  linkedIncidents: string[]; associatedOffenders: string[];
  riskScore: number; status: "active" | "incarcerated" | "released";
  convictions: number; photoInitials: string;
}
export const offenders: Offender[] = Array.from({ length: 30 }, (_, i) => {
  const first = pick(FIRST), last = pick(LAST);
  const district = pick(DISTRICTS).name;
  const moTags = Array.from(new Set([pick(MO_POOL), pick(MO_POOL), pick(MO_POOL)])).slice(0, 3);
  const id = `OFF-${(i + 1).toString().padStart(3, "0")}`;
  return {
    id,
    name: `${first} ${last}`,
    age: intBetween(19, 58),
    gender: rand() < 0.85 ? "M" : "F",
    district,
    primaryMO: moTags[0],
    moTags,
    linkedIncidents: incidents.filter((x) => x.offenderId === id).map((x) => x.id),
    associatedOffenders: [],
    riskScore: intBetween(35, 98),
    status: pick(["active", "incarcerated", "released"] as const),
    convictions: intBetween(0, 6),
    photoInitials: `${first[0]}${last[0]}`,
  };
});
offenders.forEach((o) => {
  const n = intBetween(2, 4);
  const set = new Set<string>();
  while (set.size < n) {
    const id = offenders[intBetween(0, offenders.length - 1)].id;
    if (id !== o.id) set.add(id);
  }
  o.associatedOffenders = Array.from(set);
});

export interface DistrictStat {
  name: DistrictName; lat: number; lng: number; crimeCount: number;
  solvedCount: number; pendingCount: number; population: number;
  socioEconomicIndex: number; urbanizationRate: number; yoyChange: number;
}
export const districtStats: DistrictStat[] = DISTRICTS.map((d) => {
  const baseCount = 800 + Math.floor(rand() * 4000);
  return {
    name: d.name, lat: d.lat, lng: d.lng,
    crimeCount: baseCount,
    solvedCount: Math.floor(baseCount * (0.45 + rand() * 0.3)),
    pendingCount: Math.floor(baseCount * (0.1 + rand() * 0.2)),
    population: d.population,
    socioEconomicIndex: intBetween(45, 88),
    urbanizationRate: intBetween(35, 95),
    yoyChange: parseFloat((between(-12, 28)).toFixed(1)),
  };
});

export interface MonthlyTrendPoint { month: string; [k: string]: string | number; }
export const monthlyTrends: MonthlyTrendPoint[] = (() => {
  const out: MonthlyTrendPoint[] = [];
  const start = new Date(2022, 0, 1);
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const row: MonthlyTrendPoint = { month: d.toLocaleString("en", { month: "short", year: "2-digit" }) };
    CRIME_TYPES.forEach((ct, idx) => {
      const seasonal = Math.sin((i / 6) + idx) * 30;
      const trend = i * (idx === 2 ? 2.5 : 0.7);
      const noise = (rand() - 0.5) * 40;
      row[ct] = Math.max(20, Math.round(100 + seasonal + trend + noise));
    });
    out.push(row);
  }
  return out;
})();

export interface Hotspot {
  id: string; lat: number; lng: number; intensity: number; district: DistrictName;
  dominantCrimeType: CrimeType; incidentCount: number; isSpike: boolean; spikePct: number;
}
export const hotspots: Hotspot[] = Array.from({ length: 18 }, (_, i) => {
  const d = pick(DISTRICTS);
  const isSpike = rand() < 0.35;
  return {
    id: `HS-${i + 1}`,
    lat: d.lat + (rand() - 0.5) * 0.4,
    lng: d.lng + (rand() - 0.5) * 0.4,
    intensity: between(0.4, 1),
    district: d.name,
    dominantCrimeType: pick(CRIME_TYPES),
    incidentCount: intBetween(15, 220),
    isSpike,
    spikePct: isSpike ? intBetween(30, 95) : 0,
  };
});

export interface NetworkNode {
  id: string; label: string; type: "offender" | "victim" | "location" | "organization";
  district: string; incidentCount: number; riskScore: number;
}
export interface NetworkEdge {
  source: string; target: string;
  type: "co_accused" | "shared_location" | "financial" | "victim_link"; weight: number;
}
export const networkNodes: NetworkNode[] = (() => {
  const nodes: NetworkNode[] = [];
  for (let i = 0; i < 30; i++) {
    const o = offenders[i % offenders.length];
    nodes.push({ id: `N-O${i}`, label: o.name, type: "offender", district: o.district, incidentCount: intBetween(1, 12), riskScore: o.riskScore });
  }
  for (let i = 0; i < 8; i++) nodes.push({ id: `N-V${i}`, label: `Victim ${i + 1}`, type: "victim", district: pick(DISTRICTS).name, incidentCount: intBetween(1, 3), riskScore: 0 });
  for (let i = 0; i < 8; i++) nodes.push({ id: `N-L${i}`, label: `${pick(DISTRICTS).name} ${pick(["Junction","Market","Layout","Mall","Park"])}`, type: "location", district: pick(DISTRICTS).name, incidentCount: intBetween(3, 25), riskScore: intBetween(20, 90) });
  for (let i = 0; i < 6; i++) nodes.push({ id: `N-G${i}`, label: `Org ${String.fromCharCode(65 + i)}`, type: "organization", district: pick(DISTRICTS).name, incidentCount: intBetween(5, 30), riskScore: intBetween(40, 95) });
  return nodes;
})();
export const networkEdges: NetworkEdge[] = (() => {
  const edges: NetworkEdge[] = [];
  const ids = networkNodes.map((n) => n.id);
  const seen = new Set<string>();
  while (edges.length < 75) {
    const s = pick(ids), t = pick(ids);
    if (s === t) continue;
    const k = [s, t].sort().join("|");
    if (seen.has(k)) continue;
    seen.add(k);
    edges.push({ source: s, target: t, type: pick(["co_accused","shared_location","financial","victim_link"] as const), weight: between(0.4, 1) });
  }
  return edges;
})();

export interface PredictedRisk {
  district: DistrictName; riskScore: number; topCrimeType: CrimeType;
  confidence: number; trend: number; recommendation: string;
}
export const predictedRisks: PredictedRisk[] = DISTRICTS.map((d) => ({
  district: d.name,
  riskScore: intBetween(28, 92),
  topCrimeType: pick(CRIME_TYPES),
  confidence: intBetween(72, 96),
  trend: parseFloat(between(-15, 35).toFixed(1)),
  recommendation: "Increase patrolling in identified high-density commercial zones; deploy cyber-cell support during 8PM–2AM peak window.",
}));

export interface AnomalyAlert {
  id: string; severity: "critical" | "high" | "medium"; type: string;
  district: DistrictName; crimeType: CrimeType; description: string;
  timestamp: string; resolved: boolean; relatedIncidents: string[]; unread: boolean;
}
const ALERT_TYPES = ["Spike Detected", "New Association Found", "Unusual Pattern", "MO Match", "Cluster Forming"];
export const anomalyAlerts: AnomalyAlert[] = Array.from({ length: 25 }, (_, i) => {
  const sev = pick(["critical","high","medium"] as const);
  const d = pick(DISTRICTS).name;
  const ct = pick(CRIME_TYPES);
  const pct = intBetween(28, 110);
  const hoursAgo = intBetween(1, 96);
  return {
    id: `ALT-${(i + 1).toString().padStart(3, "0")}`,
    severity: sev,
    type: pick(ALERT_TYPES),
    district: d,
    crimeType: ct,
    description: `${pct}% increase in ${ct.toLowerCase()} incidents over 72 hours. Baseline: ${(2 + rand() * 5).toFixed(1)}/week. Current: ${(6 + rand() * 6).toFixed(1)}/week.`,
    timestamp: new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString(),
    resolved: rand() < 0.2,
    relatedIncidents: incidents.slice(i * 2, i * 2 + 3).map((x) => x.id),
    unread: rand() < 0.5,
  };
});

export interface ForecastPoint {
  date: string; actual?: number; forecast?: number; lower?: number; upper?: number;
}
export function buildForecast(crimeType: CrimeType, days = 90): ForecastPoint[] {
  const out: ForecastPoint[] = [];
  const today = new Date();
  const base = 40 + CRIME_TYPES.indexOf(crimeType) * 7;
  for (let i = -60; i < days; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const seasonal = Math.sin(i / 10) * 8;
    const trend = i * 0.15;
    const noise = (rand() - 0.5) * 10;
    const v = Math.max(5, Math.round(base + seasonal + trend + noise));
    if (i < 0) out.push({ date: d.toISOString().slice(0, 10), actual: v });
    else {
      const f = Math.max(5, Math.round(base + seasonal + trend));
      const ci = 6 + Math.abs(i) / 8;
      out.push({ date: d.toISOString().slice(0, 10), forecast: f, lower: Math.max(0, Math.round(f - ci)), upper: Math.round(f + ci) });
    }
  }
  return out;
}

export const calendarHeat: { date: string; count: number; topType: CrimeType }[] = (() => {
  const out = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const weekendBoost = dow === 0 || dow === 6 ? 1.4 : 1;
    out.push({
      date: d.toISOString().slice(0, 10),
      count: Math.max(0, Math.round((4 + rand() * 18) * weekendBoost)),
      topType: pick(CRIME_TYPES),
    });
  }
  return out;
})();

export const hourlyPattern: { hour: number; count: number }[] = Array.from({ length: 24 }, (_, h) => {
  const peakBoost = (h >= 22 || h <= 2) ? 2.2 : (h >= 18 && h <= 21 ? 1.5 : 1);
  return { hour: h, count: Math.round((30 + rand() * 40) * peakBoost) };
});

export const correlationMatrix: number[][] = (() => {
  const m: number[][] = [];
  for (let i = 0; i < CRIME_TYPES.length; i++) {
    m[i] = [];
    for (let j = 0; j < CRIME_TYPES.length; j++) {
      if (i === j) m[i][j] = 1;
      else if (j < i) m[i][j] = m[j][i];
      else m[i][j] = parseFloat((rand() * 1.6 - 0.6).toFixed(2));
    }
  }
  return m;
})();

export const aiInsights = [
  { icon: "🌐", category: "Cybercrime", confidence: 92, headline: "Cybercrime in Bengaluru Urban up 43% — correlates with 3 new IT corridors", detail: "Phishing variants targeting tech-park employees observed in Whitefield, ITPL and Electronic City." },
  { icon: "💊", category: "Narcotics",  confidence: 87, headline: "Drug offense network expanding from Belagavi toward Hubli-Dharwad", detail: "Cross-jurisdiction movement detected through associated offender clustering — recommend joint operation." },
  { icon: "👥", category: "Assault",    confidence: 84, headline: "Weekend assault spikes linked to 12 recurring venue clusters", detail: "Friday/Saturday 10PM–2AM peak. Bengaluru Urban accounts for 61% of cluster activity." },
  { icon: "🚗", category: "Theft",      confidence: 79, headline: "Vehicle theft pattern shift toward two-wheelers in Mysuru", detail: "MO change — keyless entry exploitation in 4 incidents this month." },
  { icon: "📞", category: "Fraud",      confidence: 90, headline: "Senior citizen tele-fraud cluster forming in Mangaluru", detail: "Loss-amount range ₹40k–₹2L. Recommend public-awareness drive within 14 days." },
];
