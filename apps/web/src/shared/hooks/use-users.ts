import type {
	ApiResponse,
	FindAllUsersParams,
	PaginatedUsers,
	UpdateUserDTO,
	UserResponse,
} from "@/src/shared/services";
import { usersService } from "@/src/shared/services";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Query Keys ──────────────────────────────────────────────

export const usersKeys = {
	all: ["users"] as const,
	lists: () => [...usersKeys.all, "list"] as const,
	list: (params?: FindAllUsersParams) =>
		[...usersKeys.lists(), params] as const,
	details: () => [...usersKeys.all, "detail"] as const,
	detail: (id: number) => [...usersKeys.details(), id] as const,
};

// ── Use Users List ──────────────────────────────────────────

export function useUsers(params?: FindAllUsersParams) {
	return useQuery({
		queryKey: usersKeys.list(params),
		queryFn: async (): Promise<PaginatedUsers | null> => {
			const res = await usersService.getAll(params);
			return res.success ? res.data : null;
		},
	});
}

// ── Use User Detail ─────────────────────────────────────────

export function useUser(id: number) {
	return useQuery({
		queryKey: usersKeys.detail(id),
		queryFn: async (): Promise<UserResponse | null> => {
			const res = await usersService.getById(id);
			return res.success ? res.data.user : null;
		},
		enabled: id > 0,
	});
}

// ── Use Update User ─────────────────────────────────────────

export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			dto,
		}: {
			id: number;
			dto: UpdateUserDTO;
		}): Promise<ApiResponse<{ user: UserResponse }>> =>
			usersService.update(id, dto),
		onSuccess: (data, variables) => {
			if (data.success) {
				queryClient.setQueryData(
					usersKeys.detail(variables.id),
					data.data.user,
				);
				queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
			}
		},
	});
}

// ── Use Update User Role ────────────────────────────────────

export function useUpdateUserRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			roleId,
		}: {
			id: number;
			roleId: number;
		}): Promise<ApiResponse<{ user: UserResponse }>> =>
			usersService.updateRole(id, roleId),
		onSuccess: (data, variables) => {
			if (data.success) {
				queryClient.setQueryData(
					usersKeys.detail(variables.id),
					data.data.user,
				);
				queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
			}
		},
	});
}

// ── Use Update User Status ──────────────────────────────────

export function useUpdateUserStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			isActive,
		}: {
			id: number;
			isActive: boolean;
		}): Promise<ApiResponse<{ user: UserResponse }>> =>
			usersService.updateStatus(id, isActive),
		onSuccess: (data, variables) => {
			if (data.success) {
				queryClient.setQueryData(
					usersKeys.detail(variables.id),
					data.data.user,
				);
				queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
			}
		},
	});
}

// ── Use Delete User ─────────────────────────────────────────

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number): Promise<ApiResponse<{ message: string }>> =>
			usersService.delete(id),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		},
	});
}
