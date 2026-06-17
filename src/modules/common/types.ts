export type ListMeta = {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
  limit: number;
};

export type Paginated<T> = { items: T[]; meta: ListMeta };

export type ListQuery = { search?: string; page: number; limit: number };
