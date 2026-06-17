import { useCallback } from "react";
import { ResourceListPage } from "@/modules/common/ResourceListPage";
import { useCustomers } from "../hooks/useCustomers";
import { formatDate } from "@/lib/utils";
import type { Customer } from "../types";

export function CustomersPage() {
  const buildQuery = useCallback(
    ({ search, page, limit }: { search: string; page: number; limit: number }) => ({ search, page, limit }),
    [],
  );

  return (
    <ResourceListPage<Customer, { search: string; page: number; limit: number }>
      title="Customers"
      subtitle="Registered shoppers"
      searchPlaceholder="Search name, email, phone…"
      minTableWidth="min-w-[640px]"
      hideActionsColumn
      hideCreateButton
      useList={useCustomers}
      buildQuery={buildQuery}
      columns={[
        { header: "Name", getValue: (c) => <span className="font-medium text-foreground">{c.name}</span> },
        { header: "Email", getValue: (c) => <span className="text-muted-foreground">{c.email}</span> },
        { header: "Phone", getValue: (c) => c.phone || "—" },
        { header: "Addresses", getValue: (c) => c.addresses?.length ?? 0 },
        { header: "Joined", getValue: (c) => formatDate(c.createdAt) },
      ]}
    />
  );
}
