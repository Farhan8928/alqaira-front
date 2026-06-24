export type StoreSettings = {
  storeName: string;
  tagline?: string;
  logo?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsapp?: string;
  addressLine?: string;
  instagram?: string;
  facebook?: string;
  currency?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  codEnabled?: boolean;
  onlinePaymentEnabled?: boolean;
  announcement?: string;
  /** Editable size-chart rows keyed by chart id; empty = use built-in defaults. */
  sizeChartRows?: Record<string, Array<Record<string, string | number>>>;
};

export type SettingsPayload = Partial<StoreSettings>;
