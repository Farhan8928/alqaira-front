export type Coupon = {
  id: string;
  code: string;
  description?: string;
  type: "percent" | "flat";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startsAt?: string;
  expiresAt?: string;
  isActive: boolean;
};

export type CouponPayload = {
  code: string;
  description?: string;
  type: "percent" | "flat";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isActive?: boolean;
};

export type CouponListQuery = { search?: string; page: number; limit: number };
