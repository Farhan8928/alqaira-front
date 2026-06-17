import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { StoreLayout } from "./app/layouts/StoreLayout";
import { AdminLayout } from "./app/layouts/admin/AdminLayout";
import { RequireAdmin } from "./app/router/RequireAdmin";
import { PageLoader } from "./shared/components/PageLoader";
import { NotFound } from "./shared/components/NotFound";

// ── Storefront ────────────────────────────────────────────────────────────────
const HomePage = lazy(() =>
  import("./modules/home/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const ShopPage = lazy(() =>
  import("./modules/product/pages/ShopPage").then((m) => ({ default: m.ShopPage })),
);
const ProductPage = lazy(() =>
  import("./modules/product/pages/ProductPage").then((m) => ({ default: m.ProductPage })),
);
const CartPage = lazy(() =>
  import("./modules/cart/pages/CartPage").then((m) => ({ default: m.CartPage })),
);
const WishlistPage = lazy(() =>
  import("./modules/wishlist/pages/WishlistPage").then((m) => ({ default: m.WishlistPage })),
);
const CheckoutPage = lazy(() =>
  import("./modules/order/pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })),
);
const OrderConfirmedPage = lazy(() =>
  import("./modules/order/pages/OrderConfirmedPage").then((m) => ({
    default: m.OrderConfirmedPage,
  })),
);
const TrackOrderPage = lazy(() =>
  import("./modules/order/pages/TrackOrderPage").then((m) => ({ default: m.TrackOrderPage })),
);
const LoginPage = lazy(() =>
  import("./modules/account/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./modules/account/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const AccountPage = lazy(() =>
  import("./modules/account/pages/AccountPage").then((m) => ({ default: m.AccountPage })),
);
const AboutPage = lazy(() =>
  import("./modules/home/pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactPage = lazy(() =>
  import("./modules/home/pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);

// ── Admin ─────────────────────────────────────────────────────────────────────
const AdminLoginPage = lazy(() =>
  import("./modules/auth/pages/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);
const DashboardPage = lazy(() =>
  import("./modules/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ProductsPage = lazy(() =>
  import("./modules/product/pages/ProductsPage").then((m) => ({ default: m.ProductsPage })),
);
const CategoriesPage = lazy(() =>
  import("./modules/category/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const OrdersPage = lazy(() =>
  import("./modules/order/pages/OrdersPage").then((m) => ({ default: m.OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("./modules/order/pages/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })),
);
const CustomersPage = lazy(() =>
  import("./modules/customer/pages/CustomersPage").then((m) => ({ default: m.CustomersPage })),
);
const CouponsPage = lazy(() =>
  import("./modules/coupon/pages/CouponsPage").then((m) => ({ default: m.CouponsPage })),
);
const ReviewsPage = lazy(() =>
  import("./modules/review/pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })),
);
const SettingsPage = lazy(() =>
  import("./modules/settings/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const UsersPage = lazy(() =>
  import("./modules/auth/pages/UsersPage").then((m) => ({ default: m.UsersPage })),
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin panel */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Storefront */}
        <Route element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmed/:orderNumber" element={<OrderConfirmedPage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
