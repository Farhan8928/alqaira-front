import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  image?: string | null;
  price: number;
  compareAtPrice?: number;
};

type State = { items: WishlistItem[] };

const KEY = "alqaira.wishlist";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { items: [] };
    const p = JSON.parse(raw) as State;
    return { items: Array.isArray(p.items) ? p.items : [] };
  } catch {
    return { items: [] };
  }
}

function persist(state: State) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

const slice = createSlice({
  name: "wishlist",
  initialState: load(),
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(action.payload);
      persist(state);
    },
    removeWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      persist(state);
    },
  },
});

export const { toggleWishlist, removeWishlist } = slice.actions;
export default slice.reducer;
