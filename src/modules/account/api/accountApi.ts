import { http } from "@/shared/api/http";
import type { Customer, AddressPayload } from "../types";

export type AuthResult = { accessToken: string; customer: Customer };

export async function registerCustomer(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const res = await http.post<{ data: AuthResult }>("/account/register", payload);
  return res.data.data;
}

export async function loginCustomer(payload: { email: string; password: string }) {
  const res = await http.post<{ data: AuthResult }>("/account/login", payload);
  return res.data.data;
}

export async function fetchMe() {
  const res = await http.get<{ data: Customer }>("/account/me");
  return res.data.data;
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  password?: string;
  currentPassword?: string;
}) {
  const res = await http.patch<{ data: Customer }>("/account/me", payload);
  return res.data.data;
}

export async function addAddress(payload: AddressPayload) {
  const res = await http.post<{ data: Customer }>("/account/addresses", payload);
  return res.data.data;
}

export async function updateAddress(id: string, payload: Partial<AddressPayload>) {
  const res = await http.patch<{ data: Customer }>(`/account/addresses/${id}`, payload);
  return res.data.data;
}

export async function deleteAddress(id: string) {
  const res = await http.delete<{ data: Customer }>(`/account/addresses/${id}`);
  return res.data.data;
}
