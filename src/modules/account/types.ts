export type Address = {
  id: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  isActive?: boolean;
  createdAt?: string;
};

export type AddressPayload = Omit<Address, "id">;
