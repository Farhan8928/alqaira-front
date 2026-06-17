import { adminHttp } from "@/shared/api/http";
import type { ListMeta } from "./types";

type ListResponse<T> = { data: T[]; meta: ListMeta };

/**
 * Builds a typed CRUD client for an admin resource over the admin HTTP client.
 * Mirrors the reference CRM's createResourceApi so admin list pages can reuse
 * ResourceListPage + createResourceHooks unchanged.
 */
export function createResourceApi<TItem, TListQuery extends object, TCreatePayload extends object>(
  resourcePath: string,
) {
  return {
    async list(query: TListQuery) {
      const res = await adminHttp.get<ListResponse<TItem>>(resourcePath, { params: query });
      return { items: res.data.data, meta: res.data.meta };
    },
    async getById(id: string) {
      const res = await adminHttp.get<{ data: TItem }>(`${resourcePath}/${id}`);
      return res.data.data;
    },
    async create(payload: TCreatePayload) {
      const res = await adminHttp.post<{ data: TItem }>(resourcePath, payload);
      return res.data.data;
    },
    async update(id: string, payload: Partial<TCreatePayload>) {
      const res = await adminHttp.patch<{ data: TItem }>(`${resourcePath}/${id}`, payload);
      return res.data.data;
    },
    async remove(id: string) {
      await adminHttp.delete(`${resourcePath}/${id}`);
    },
  };
}
