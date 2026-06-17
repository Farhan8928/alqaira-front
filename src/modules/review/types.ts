export type Review = {
  id: string;
  product: string | { id: string; name: string; slug: string } | null;
  customer?: string | null;
  customerName?: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
};

export type ReviewListQuery = { isApproved?: boolean; page: number; limit: number };
