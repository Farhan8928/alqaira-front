import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPublicSettings, fetchAdminSettings, updateSettings } from "../api/settingsApi";
import type { SettingsPayload } from "../types";

export function useStoreSettings() {
  return useQuery({
    queryKey: ["settings", "public"],
    queryFn: fetchPublicSettings,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAdminSettings() {
  return useQuery({ queryKey: ["settings", "admin"], queryFn: fetchAdminSettings });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SettingsPayload) => updateSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
