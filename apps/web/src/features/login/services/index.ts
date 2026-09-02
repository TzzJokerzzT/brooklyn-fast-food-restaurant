import { apiClient } from "@/src/shared/lib/axios";
import type { ApiResponse } from "@/src/shared/services";
import type {
  CreateLoginDTO,
  FindAllLoginParams,
  PaginatedLogin,
  UpdateLoginDTO,
  Login,
} from "../types";

// ── Login Service ────────────────────────────────────
// API calls using the shared Axios client

const BASE = "/login";

export const loginService = {
  async getAll(
    params?: FindAllLoginParams,
  ): Promise<ApiResponse<PaginatedLogin>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedLogin>>(
      BASE,
      { params },
    );
    return data;
  },

  async getById(id: number): Promise<ApiResponse<{ item: Login }>> {
    const { data } = await apiClient.get<ApiResponse<{ item: Login }>>(
      `${BASE}/${id}`,
    );
    return data;
  },

  async create(
    dto: CreateLoginDTO,
  ): Promise<ApiResponse<{ item: Login }>> {
    const { data } = await apiClient.post<ApiResponse<{ item: Login }>>(
      BASE,
      dto,
    );
    return data;
  },

  async update(
    id: number,
    dto: UpdateLoginDTO,
  ): Promise<ApiResponse<{ item: Login }>> {
    const { data } = await apiClient.put<ApiResponse<{ item: Login }>>(
      `${BASE}/${id}`,
      dto,
    );
    return data;
  },

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${BASE}/${id}`,
    );
    return data;
  },
};
