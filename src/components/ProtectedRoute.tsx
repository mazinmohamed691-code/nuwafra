import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";
export default function ProtectedRoute({ children, role }: { children: ReactNode; role?: Role | Role[]; }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  }
  return <>{children}</>;
}