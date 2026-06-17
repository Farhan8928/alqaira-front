import axios from "axios";
import { store } from "@/app/store";
import { clearCustomer } from "@/modules/account/accountSlice";
import { clearAdmin } from "@/modules/auth/authSlice";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api";

/**
 * Storefront / customer client. Attaches the customer token when present so
 * the same instance serves public reads (no token) and logged-in customer
 * actions. A 401 clears the customer session and bounces to the store login.
 */
export const http = axios.create({ baseURL, timeout: 20000 });

http.interceptors.request.use((config) => {
  const token = store.getState().customerAuth.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const hadToken = Boolean(store.getState().customerAuth.accessToken);
      if (hadToken) store.dispatch(clearCustomer());
    }
    return Promise.reject(err);
  },
);

/**
 * Admin-panel client. Attaches the staff token. A 401 clears the admin session
 * and redirects to /admin/login.
 */
export const adminHttp = axios.create({ baseURL, timeout: 20000 });

adminHttp.interceptors.request.use((config) => {
  const token = store.getState().adminAuth.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminHttp.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const hadToken = Boolean(store.getState().adminAuth.accessToken);
      if (hadToken) store.dispatch(clearAdmin());
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        if (window.location.pathname !== "/admin/login") window.location.assign("/admin/login");
      }
    }
    return Promise.reject(err);
  },
);

type ApiErrorResponse = {
  error?: { message?: string; details?: Array<{ path?: string; message?: string }> };
};

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) {
      const detail = data.error.details?.[0]?.message;
      if (data.error.message === "Validation error" && detail) return detail;
      return String(data.error.message);
    }
    if (err.message) return err.message;
  }
  return "Something went wrong";
}
