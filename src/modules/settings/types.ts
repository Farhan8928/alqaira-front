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
};

export type SettingsPayload = Partial<StoreSettings>;
