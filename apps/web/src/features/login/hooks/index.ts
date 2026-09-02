"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginService } from "../services";
import { loginKeys } from "../queries";
import type {
  CreateLoginDTO,
  FindAllLoginParams,
  PaginatedLogin,
  UpdateLoginDTO,
  Login,
} from "../types";
import type { ApiResponse } from "@/src/shared/services";

// ── Use Login List ─────────────────────────────────────

export function useLogins(params?: FindAllLoginParams) {
  return useQuery({
    queryKey: loginKeys.list(params),
    queryFn: async (): Promise<PaginatedLogin | null> => {
      const res = await loginService.getAll(params);
      return res.success ? res.data : null;
    },
  });
}

// ── Use Login Detail ───────────────────────────────────

export function useLogin(id: number) {
  return useQuery({
    queryKey: loginKeys.detail(id),
    queryFn: async (): Promise<Login | null> => {
      const res = await loginService.getById(id);
      return res.success ? res.data.item : null;
    },
    enabled: id > 0,
  });
}

// ── Use Create Login ───────────────────────────────────

export function useCreateLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      dto: CreateLoginDTO,
    ): Promise<ApiResponse<{ item: Login }>> =>
      loginService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loginKeys.lists() });
    },
  });
}

// ── Use Update Login ───────────────────────────────────

export function useUpdateLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: UpdateLoginDTO;
    }): Promise<ApiResponse<{ item: Login }>> =>
      loginService.update(id, dto),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.setQueryData(
          loginKeys.detail(variables.id),
          data.data.item,
        );
        queryClient.invalidateQueries({ queryKey: loginKeys.lists() });
      }
    },
  });
}

// ── Use Delete Login ──────────────────────────────────

export function useDeleteLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: number,
    ): Promise<ApiResponse<{ message: string }>> =>
      loginService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: loginKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: loginKeys.lists() });
    },
  });
}
