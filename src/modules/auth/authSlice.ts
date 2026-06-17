import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AdminRole = "admin" | "manager" | "staff";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type State = { accessToken: string | null; user: AdminUser | null };

const KEY = "alqaira.admin";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { accessToken: null, user: null };
    const p = JSON.parse(raw) as State;
    return { accessToken: p.accessToken ?? null, user: p.user ?? null };
  } catch {
    return { accessToken: null, user: null };
  }
}

const slice = createSlice({
  name: "adminAuth",
  initialState: load(),
  reducers: {
    setAdmin(state, action: PayloadAction<{ accessToken: string; user: AdminUser }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem(KEY, JSON.stringify(state));
    },
    clearAdmin(state) {
      state.accessToken = null;
      state.user = null;
      localStorage.setItem(KEY, JSON.stringify(state));
    },
  },
});

export const { setAdmin, clearAdmin } = slice.actions;
export default slice.reducer;
