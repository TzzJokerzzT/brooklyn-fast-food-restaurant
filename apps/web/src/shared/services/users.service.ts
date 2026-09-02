import { apiClient } from "@/src/shared/lib/axios";

import type {
	ApiResponse,
	CreateUserDTO,
	FindAllUsersParams,
	PaginatedUsers,
	UpdateUserDTO,
	UserResponse,
} from "./types";

// ── Users Service ───────────────────────────────────────────
// Admin user management API calls

export const usersService = {
	async create(
		dto: CreateUserDTO,
	): Promise<ApiResponse<{ user: UserResponse }>> {
		const { data } = await apiClient.post<ApiResponse<{ user: UserResponse }>>(
			"/users",
			dto,
		);
		return data;
	},

	async getAll(
		params?: FindAllUsersParams,
	): Promise<ApiResponse<PaginatedUsers>> {
		const { data } = await apiClient.get<ApiResponse<PaginatedUsers>>(
			"/users",
			{ params },
		);
		return data;
	},

	async getById(id: number): Promise<ApiResponse<{ user: UserResponse }>> {
		const { data } = await apiClient.get<ApiResponse<{ user: UserResponse }>>(
			`/users/${id}`,
		);
		return data;
	},

	async update(
		id: number,
		dto: UpdateUserDTO,
	): Promise<ApiResponse<{ user: UserResponse }>> {
		const { data } = await apiClient.put<ApiResponse<{ user: UserResponse }>>(
			`/users/${id}`,
			dto,
		);
		return data;
	},

	async updateRole(
		id: number,
		roleId: number,
	): Promise<ApiResponse<{ user: UserResponse }>> {
		const { data } = await apiClient.patch<ApiResponse<{ user: UserResponse }>>(
			`/users/${id}/role`,
			{ roleId },
		);
		return data;
	},

	async updateStatus(
		id: number,
		isActive: boolean,
	): Promise<ApiResponse<{ user: UserResponse }>> {
		const { data } = await apiClient.patch<ApiResponse<{ user: UserResponse }>>(
			`/users/${id}/status`,
			{ isActive },
		);
		return data;
	},

	async delete(id: number): Promise<ApiResponse<{ message: string }>> {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/users/${id}`,
		);
		return data;
	},
};
