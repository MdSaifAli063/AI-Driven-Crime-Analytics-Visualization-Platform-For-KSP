import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Sidebar, MobileTabBar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/map": "Geospatial Hotspot Map",
  "/dashboard/network": "Network & Link Analysis",
  "/dashboard/trends": "Trend Analytics",
  "/dashboard/predictions": "AI Predictions",
  "/dashboard/offenders": "Offender Profiles",
  "/dashboard/alerts": "Anomaly Alerts",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "My Profile",
};

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] || "Dashboard";
  return (
    <ProtectedRoute>
      <div className="aurora-bg flex min-h-screen bg-base">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <Header title={title} />
          <main className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6"><Outlet /></main>
        </div>
        <MobileTabBar />
      </div>
    </ProtectedRoute>
  );
}
