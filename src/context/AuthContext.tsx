import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MOCK_USERS, type User } from "@/data/users";

type SessionUser = Omit<User, "password">;

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (input: { name: string; email: string; password: string; district: string; role?: SessionUser["role"] }) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (patch: Partial<Pick<SessionUser, "name" | "district" | "avatar" | "avatarUrl">>) => void;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "crimeiq-session";
const USERS_KEY = "crimeiq-users";

function loadExtraUsers(): User[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveExtraUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setIsReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const all = [...MOCK_USERS, ...loadExtraUsers()];
    const match = all.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!match) return false;
    const { password: _pw, ...safe } = match;
    const session: SessionUser = { ...safe, lastLogin: new Date().toISOString() };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  };

  const signup: AuthContextValue["signup"] = async ({ name, email, password, district, role = "VIEWER" }) => {
    await new Promise((r) => setTimeout(r, 900));
    const all = [...MOCK_USERS, ...loadExtraUsers()];
    if (all.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const permsByRole: Record<SessionUser["role"], string[]> = {
      SCRB_ADMIN: ["view_all", "export", "manage_users", "ai_predictions", "network_analysis"],
      DISTRICT_ANALYST: ["view_district", "export", "ai_predictions", "network_analysis"],
      FIELD_OFFICER: ["view_district", "view_alerts"],
      VIEWER: ["view_all"],
    };
    const newUser: User = {
      id: `u${Date.now()}`,
      email, password, name, role, district,
      avatar: name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "U",
      permissions: permsByRole[role],
    };
    saveExtraUsers([...loadExtraUsers(), newUser]);
    const { password: _pw, ...safe } = newUser;
    const session: SessionUser = { ...safe, lastLogin: new Date().toISOString() };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true };
  };

  const updateProfile: AuthContextValue["updateProfile"] = (patch) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next);
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    const extras = loadExtraUsers();
    const idx = extras.findIndex((u) => u.id === user.id);
    if (idx >= 0) { extras[idx] = { ...extras[idx], ...patch }; saveExtraUsers(extras); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const hasPermission = (perm: string) => !!user?.permissions.includes(perm);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isReady, login, signup, updateProfile, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}