export type OrderItem = {
  product?: string | null;
  productName: string;
  slug?: string;
  image?: string;
  variantId?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "razorpay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Order = {
  id: string;
  orderNumber: string;
  customer?: { id: string; name?: string; email?: string } | null;
  isGuest?: boolean;
  contact: { name?: string; email?: string; phone?: string };
  items: OrderItem[];
  shippingAddress: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpay?: { orderId?: string };
  status: OrderStatus;
  statusHistory: { status: string; note?: string; at: string }[];
  notes?: string;
  placedAt: string;
  createdAt: string;
};

export type PaymentConfig = {
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  razorpayConfigured: boolean;
  razorpayKey: string | null;
};

export type PlaceOrderItem = { productId: string; variantId: string; quantity: number };

export type PlaceOrderPayload = {
  items: PlaceOrderItem[];
  contact: { name: string; email: string; phone: string };
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    pincode: string;
    country?: string;
  };
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
};

export type RazorpayInit = {
  provider: "razorpay";
  key: string;
  orderId: string;
  amount: number;
  currency: string;
};

export type OrderListQuery = {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  page: number;
  limit: number;
};
