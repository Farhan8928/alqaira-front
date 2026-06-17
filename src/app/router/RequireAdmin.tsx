import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const token = useAppSelector((s) => s.adminAuth.accessToken);
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
