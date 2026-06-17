import { adminHttp } from "@/shared/api/http";
import type { DashboardData } from "../types";

export async function fetchDashboard() {
  const res = await adminHttp.get<{ data: DashboardData }>("/admin/dashboard/overview");
  return res.data.data;
}
