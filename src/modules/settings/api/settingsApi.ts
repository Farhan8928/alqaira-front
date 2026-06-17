import { http, adminHttp } from "@/shared/api/http";
import type { StoreSettings, SettingsPayload } from "../types";

export async function fetchPublicSettings() {
  const res = await http.get<{ data: StoreSettings }>("/settings/public");
  return res.data.data;
}

export async function fetchAdminSettings() {
  const res = await adminHttp.get<{ data: StoreSettings & { id: string } }>("/settings");
  return res.data.data;
}

export async function updateSettings(payload: SettingsPayload) {
  const res = await adminHttp.patch<{ data: StoreSettings & { id: string } }>("/settings", payload);
  return res.data.data;
}
