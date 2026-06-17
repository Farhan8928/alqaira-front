import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Customer } from "./types";

type State = { accessToken: string | null; customer: Customer | null };

const KEY = "alqaira.customer";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { accessToken: null, customer: null };
    const p = JSON.parse(raw) as State;
    return { accessToken: p.accessToken ?? null, customer: p.customer ?? null };
  } catch {
    return { accessToken: null, customer: null };
  }
}

const slice = createSlice({
  name: "customerAuth",
  initialState: load(),
  reducers: {
    setCustomer(state, action: PayloadAction<{ accessToken: string; customer: Customer }>) {
      state.accessToken = action.payload.accessToken;
      state.customer = action.payload.customer;
      localStorage.setItem(KEY, JSON.stringify(state));
    },
    updateCustomer(state, action: PayloadAction<Customer>) {
      state.customer = action.payload;
      localStorage.setItem(KEY, JSON.stringify(state));
    },
    clearCustomer(state) {
      state.accessToken = null;
      state.customer = null;
      localStorage.setItem(KEY, JSON.stringify(state));
    },
  },
});

export const { setCustomer, updateCustomer, clearCustomer } = slice.actions;
export default slice.reducer;
