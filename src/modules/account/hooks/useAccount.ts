import { useMutation } from "@tanstack/react-query";
import {
  registerCustomer,
  loginCustomer,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../api/accountApi";
import type { AddressPayload } from "../types";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: { name: string; email: string; password: string; phone?: string }) =>
      registerCustomer(payload),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => loginCustomer(payload),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (payload: {
      name?: string;
      phone?: string;
      password?: string;
      currentPassword?: string;
    }) => updateProfile(payload),
  });
}

export function useAddAddress() {
  return useMutation({ mutationFn: (payload: AddressPayload) => addAddress(payload) });
}

export function useUpdateAddress() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      updateAddress(id, payload),
  });
}

export function useDeleteAddress() {
  return useMutation({ mutationFn: (id: string) => deleteAddress(id) });
}
