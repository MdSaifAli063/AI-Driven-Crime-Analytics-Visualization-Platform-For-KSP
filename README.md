# 🏛️ CrimeIQ Karnataka — SCRB Intelligence Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black&style=flat-square)](#)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=flat-square)](#)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&style=flat-square)](#)
[![TanStack](https://img.shields.io/badge/TanStack-Start-FF4154?logo=react&style=flat-square)](#)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white&style=flat-square)](#)

CrimeIQ Karnataka is an AI-driven, high-fidelity intelligence and predictive policing platform designed for the **Karnataka State Crime Records Bureau (SCRB)**. Moving from reactive policing to proactive intelligence, CrimeIQ integrates geospatial hotspot analysis, criminal network visualization, AI-powered predictive models, and real-time situational feeds to enhance public safety across Karnataka's districts.

---

## 🎯 Key Capabilities & Modules

### 📊 1. SCRB Executive Dashboard (`/dashboard`)
* **Live Incident Feed**: Real-time signal tracking and event streaming with severity markers (Critical, High, Medium) and simulation tools.
* **Key KPI Metrics**: Analytics covering YTD incidents, active case rates, solved ratios, repeat offender stats, and AI anomalies.
* **Categorized Analysis**: Recharts-driven visualization showing monthly crime trends, crime type distributions, and district-by-district comparisons.

### 🗺️ 2. Geospatial Hotspot Mapping (`/dashboard/map`)
* **Interactive Leaflet Maps**: High-fidelity mapping of district crime metrics across Karnataka.
* **Active Spike Analysis**: Tracks statistical anomalies and triggers red alerts for rapid spikes in district activities.
* **Pulse Rings & Heatmaps**: Visualizes predicted risk zones and localized hotspot severity.

### 🕸️ 3. Criminal Network Analysis (`/dashboard/network`)
* **Force-Directed Graph**: Multi-layered relationship plotting between offenders, victims, organizations, and crime scenes using `react-force-graph-2d`.
* **Individual Node Profiles**: Interactive lookup showing risk scores, connection counts, profiles, and instant flag actions.
* **Intelligence Legends**: Color-coded categorization of entities for structured mapping.

### 🔮 4. AI-Driven Predictive Engine (`/dashboard/predictions`)
* **Confidence Gauges**: Multi-tiered confidence gauges analyzing future risk index per district.
* **90-Day Forecaster**: Composed actual vs. forecast charts showcasing confidence intervals.
* **Socio-Economic Correlation**: Advanced correlation scatter-plotting comparing crime volumes with population density and socio-economic indices.
* **GenAI Intelligence Reports**: Distilled AI Insights highlighting emergent patterns (e.g., cyber scams, gang networks).

### 🚨 5. Alerts Center (`/dashboard/alerts`)
* **Real-time Dispatch Alerts**: Critical alert feed showing exact incident timestamps, locations, and status trackers.
* **Dispatch Logs**: Filterable feeds based on district name, category, or severity thresholds.

---

## 🛠️ Technology Stack

### Core Frameworks
* **[React 19](https://react.dev/)** — Declarative UI layer.
* **[TypeScript](https://www.typescriptlang.org/)** — Strict type safety.
* **[TanStack Start](https://tanstack.com/start)** — Full-stack framework with built-in SSR capabilities.
* **[TanStack Router](https://tanstack.com/router)** — Declarative, type-safe router with file-based routing.

### Data Visualization
* **[Recharts](https://recharts.org/)** — Interactive line, area, bar, pie, and scatter charts.
* **[Leaflet](https://leafletjs.com/)** & **[React Leaflet](https://react-leaflet.js.org/)** — Heavy-duty geospatial maps.
* **[React Force Graph](https://github.com/vasturiano/react-force-graph)** — Interactive 2D relationship modeling.

### Styling & Animation
* **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling with custom dark modes.
* **[Framer Motion](https://www.framer.com/motion/)** — Micro-animations and page transitions.
* **[Lucide React](https://lucide.dev/)** — Premium system icon library.
* **[Sonner](https://sonner.dev/)** — Interactive toast notifications.

---

## 📂 Project Structure

```bash
ksp-prism-main/
├── public/                 # Static assets (robots.txt, icons)
├── src/
│   ├── components/         # Reusable dashboard widgets, layout components
│   ├── context/            # Global state (Theme, Auth, Alerts/Notifications)
│   ├── data/               # Mock data, forecast calculators, seed information
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Formatters, styling helpers, client error boundaries
│   ├── routes/             # File-based TanStack Router pages
│   │   ├── __root.tsx      # Application layout shell & context injector
│   │   ├── dashboard.tsx   # Dashboard main layout
│   │   ├── index.tsx       # Landing page (CrimeIQ Homepage)
│   │   └── *.tsx           # Dashboard tabs (map, network, alerts, etc.)
│   ├── styles.css          # Main stylesheet & Tailwind v4 directives
│   ├── server.ts           # SSR Server entry wrapper
│   └── start.ts            # Client-side bootstrap setup
├── vite.config.ts          # Bundler configuration
├── tsconfig.json           # Compiler rules
└── package.json            # Dependencies list
```

---

## 🚀 Local Development Setup

To spin up CrimeIQ Karnataka on your machine:

### 1. Prerequisites
Make sure you have **Node.js** (v22+ recommended) and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser to interact with the platform.

### 4. Build for Production
```bash
npm run build
```
This builds two separate optimized targets inside `/dist`:
1. `/dist/client` — Static assets and SPA bundles.
2. `/dist/server` — SSR environment files.

---

## 🛡️ Security & Role-Based Access Control (RBAC)

The system includes simulated client-side and server-side route guards:
* **Superintendent / Admin (Full Access)**: View AI predictions, network diagrams, and logs.
* **District Inspector (Limited Access)**: View localized hotspot maps and logs.
* Permissions are managed via `AuthContext` and verified in `ProtectedRoute` components.
