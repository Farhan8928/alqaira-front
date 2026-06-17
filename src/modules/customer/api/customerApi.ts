import { adminHttp } from "@/shared/api/http";
import type { Paginated } from "@/modules/common/types";
import type { Customer, CustomerListQuery } from "../types";

export async function adminListCustomers(query: CustomerListQuery) {
  const res = await adminHttp.get<{ data: Customer[]; meta: Paginated<Customer>["meta"] }>(
    "/admin/customers",
    { params: query },
  );
  return { items: res.data.data, meta: res.data.meta };
}

export async function adminGetCustomer(id: string) {
  const res = await adminHttp.get<{ data: Customer }>(`/admin/customers/${id}`);
  return res.data.data;
}
