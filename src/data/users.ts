export type Role = "SCRB_ADMIN" | "DISTRICT_ANALYST" | "FIELD_OFFICER" | "VIEWER";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  district: string;
  avatar: string;
  avatarUrl?: string;
  permissions: string[];
  lastLogin?: string;
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "admin@ksp.gov.in",
    password: "admin123",
    name: "Rajesh Kumar",
    role: "SCRB_ADMIN",
    district: "All Districts",
    avatar: "RK",
    permissions: ["view_all", "export", "manage_users", "ai_predictions", "network_analysis"],
  },
  {
    id: "u2",
    email: "analyst@bengaluru.ksp.gov.in",
    password: "analyst123",
    name: "Priya Sharma",
    role: "DISTRICT_ANALYST",
    district: "Bengaluru Urban",
    avatar: "PS",
    permissions: ["view_district", "export", "ai_predictions", "network_analysis"],
  },
  {
    id: "u3",
    email: "officer@mysuru.ksp.gov.in",
    password: "officer123",
    name: "Suresh Nair",
    role: "FIELD_OFFICER",
    district: "Mysuru",
    avatar: "SN",
    permissions: ["view_district", "view_alerts"],
  },
  {
    id: "u4",
    email: "viewer@ksp.gov.in",
    password: "viewer123",
    name: "Ananya Rao",
    role: "VIEWER",
    district: "All Districts",
    avatar: "AR",
    permissions: ["view_all"],
  },
];

export const ROLE_LABELS: Record<Role, string> = {
  SCRB_ADMIN: "SCRB Administrator",
  DISTRICT_ANALYST: "District Analyst",
  FIELD_OFFICER: "Field Officer",
  VIEWER: "Viewer",
};