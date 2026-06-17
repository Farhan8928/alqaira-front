import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  listUsers,
  createUser,
  updateUser,
  type CreateUserPayload,
} from "../api/authApi";

export function useAdminLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminLogin(email, password),
  });
}

export function useUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: listUsers });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateUserPayload> & { isActive?: boolean };
    }) => updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
