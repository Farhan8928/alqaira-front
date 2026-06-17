import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Ticket,
  Users,
  Star,
  Settings,
  UserCog,
} from "lucide-react";
import type { AdminRole } from "@/modules/auth/authSlice";

export type AdminMenuItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AdminRole[];
};

export type AdminMenuSection = { heading?: string; items: AdminMenuItem[] };

export const ADMIN_SECTIONS: AdminMenuSection[] = [
  { items: [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard }] },
  {
    heading: "Catalog",
    items: [
      { label: "Products", to: "/admin/products", icon: Package, roles: ["admin", "manager"] },
      { label: "Categories", to: "/admin/categories", icon: Tags, roles: ["admin", "manager"] },
      { label: "Coupons", to: "/admin/coupons", icon: Ticket, roles: ["admin", "manager"] },
      { label: "Reviews", to: "/admin/reviews", icon: Star, roles: ["admin", "manager"] },
    ],
  },
  {
    heading: "Sales",
    items: [
      { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", to: "/admin/customers", icon: Users, roles: ["admin", "manager"] },
    ],
  },
  {
    heading: "Administration",
    items: [
      { label: "Settings", to: "/admin/settings", icon: Settings, roles: ["admin"] },
      { label: "Staff Users", to: "/admin/users", icon: UserCog, roles: ["admin"] },
    ],
  },
];

export function filterAdminSections(role: AdminRole | undefined): AdminMenuSection[] {
  return ADMIN_SECTIONS.map((s) => ({
    heading: s.heading,
    items: s.items.filter((i) => !i.roles || (role ? i.roles.includes(role) : false)),
  })).filter((s) => s.items.length > 0);
}
