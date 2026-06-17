import type { Order } from "@/modules/order/types";

export type DashboardData = {
  summary: {
    orders: number;
    revenue: number;
    thisMonthOrders: number;
    thisMonthRevenue: number;
  };
  statusBreakdown: { status: string; count: number }[];
  topProducts: { name: string; units: number; revenue: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  recentOrders: Order[];
  catalog: { totalProducts: number; activeProducts: number; customers: number };
  lowStock: { id: string; name: string; slug: string; categoryName?: string; image?: string; totalStock: number }[];
};
