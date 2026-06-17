import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image?: string | null;
  size: string;
  color?: string;
  price: number;
  quantity: number;
  maxStock: number;
};

type State = { items: CartItem[] };

const KEY = "alqaira.cart";

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
  name: "cart",
  initialState: load(),
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      );
      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, item.maxStock);
      } else {
        state.items.push({ ...item, quantity: Math.min(item.quantity, item.maxStock) });
      }
      persist(state);
    },
    setQuantity(state, action: PayloadAction<{ variantId: string; quantity: number }>) {
      const item = state.items.find((i) => i.variantId === action.payload.variantId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.maxStock));
        persist(state);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.variantId !== action.payload);
      persist(state);
    },
    clearCart(state) {
      state.items = [];
      persist(state);
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart } = slice.actions;
export default slice.reducer;

export const selectCartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.price * i.quantity, 0);
