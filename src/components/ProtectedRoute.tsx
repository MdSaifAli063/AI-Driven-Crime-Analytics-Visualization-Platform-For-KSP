import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Lock, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/data/users";

export function ProtectedRoute({ children, permission, pageName }: { children: ReactNode; permission?: string; pageName?: string; }) {
  const { isAuthenticated, isReady, user, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate({ to: "/login" });
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady) return <div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>;
  if (!isAuthenticated || !user) return null;

  const denied = permission && !hasPermission(permission);

  return (
    <div className="relative">
      <div className={denied ? "pointer-events-none blur-md select-none" : ""}>{children}</div>
      {denied && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl border border-soft bg-surface p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
              <Lock size={28} />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Access Restricted</h2>
            <p className="mt-2 text-sm text-muted">
              Your role ({ROLE_LABELS[user.role]}) does not have permission to access {pageName || "this page"}.
            </p>
            <p className="mt-1 text-xs text-muted">Required permission: <code className="font-mono">{permission}</code></p>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => alert("Contact your SCRB administrator at scrb-admin@ksp.gov.in")} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                <Mail size={14} /> Contact Administrator
              </button>
              <button onClick={() => navigate({ to: "/dashboard" })} className="inline-flex items-center gap-2 rounded-lg border border-soft bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-elevated">
                <ArrowLeft size={14} /> Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}