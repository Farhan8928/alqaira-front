import { useQuery } from "@tanstack/react-query";
import { adminListCustomers, adminGetCustomer } from "../api/customerApi";
import type { CustomerListQuery } from "../types";

export function useCustomers(query: CustomerListQuery) {
  return useQuery({ queryKey: ["admin", "customers", query], queryFn: () => adminListCustomers(query) });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "customer", id],
    queryFn: () => adminGetCustomer(id as string),
    enabled: Boolean(id),
  });
}
