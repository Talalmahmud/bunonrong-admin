import { LucideIcon } from "lucide-react";

export type TimeRange = "today" | "week" | "month" | "quarter" | "year";

/* =======================
   Stats
======================= */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
}

/* =======================
   Charts
======================= */
export interface RevenueChartItem {
  date: string; // ISO date
  revenue: number;
  previous?: number;
}

export interface OrderChartItem {
  date: string;
  orders: number;
  completed: number;
  pending: number;
}

export interface CategoryChartItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

/* =======================
   Tables
======================= */
export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "cancelled";
}
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description: string;
  color?: "blue" | "green" | "purple" | "orange";
}
