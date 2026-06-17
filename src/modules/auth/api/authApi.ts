import { adminHttp } from "@/shared/api/http";
import type { AdminUser } from "../authSlice";

export type AdminLoginResult = { accessToken: string; user: AdminUser };

export async function adminLogin(email: string, password: string) {
  const res = await adminHttp.post<{ data: AdminLoginResult }>("/auth/login", { email, password });
  return res.data.data;
}

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: AdminUser["role"];
  phone?: string;
};

export async function listUsers() {
  const res = await adminHttp.get<{ data: AdminUser[] }>("/auth/users");
  return res.data.data;
}

export async function createUser(payload: CreateUserPayload) {
  const res = await adminHttp.post<{ data: AdminUser }>("/auth/users", payload);
  return res.data.data;
}

export async function updateUser(
  id: string,
  payload: Partial<CreateUserPayload> & { isActive?: boolean },
) {
  const res = await adminHttp.patch<{ data: AdminUser }>(`/auth/users/${id}`, payload);
  return res.data.data;
}
