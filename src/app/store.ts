import { configureStore } from "@reduxjs/toolkit";
import customerAuth from "@/modules/account/accountSlice";
import adminAuth from "@/modules/auth/authSlice";
import cart from "@/modules/cart/cartSlice";
import wishlist from "@/modules/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: { customerAuth, adminAuth, cart, wishlist },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
