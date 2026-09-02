import type {
	FindAllUsersParams,
	PaginatedUsers,
	UpdateUserDTO,
	UserResponse,
} from "@/src/shared/services";
import { usersService } from "@/src/shared/services";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

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
		queryFn: async (): Promise<PaginatedUsers> => {
			const res = await usersService.getAll(params);
			return handleApiResponse(res);
		},
	});
}

// ── Use User Detail ─────────────────────────────────────────

export function useUser(id: number) {
	return useQuery({
		queryKey: usersKeys.detail(id),
		queryFn: async (): Promise<UserResponse> => {
			const res = await usersService.getById(id);
			return handleApiResponse(res).user;
		},
		enabled: id > 0,
	});
}

// ── Use Create User ─────────────────────────────────────────

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userName,
			lastName,
			email,
			password,
			roleId,
			address,
		}: {
			userName: string;
			lastName: string;
			email: string;
			password: string;
			roleId?: number;
			address?: string;
		}) =>
			usersService
				.create({ userName, lastName, email, password, roleId, address })
				.then(handleApiResponse),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		},
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
		}) =>
			usersService.update(id, dto).then(handleApiResponse),
		onSuccess: (data, variables) => {
			queryClient.setQueryData(usersKeys.detail(variables.id), data.user);
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
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
		}) => usersService.updateRole(id, roleId).then(handleApiResponse),
		onSuccess: (data, variables) => {
			queryClient.setQueryData(usersKeys.detail(variables.id), data.user);
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
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
		}) => usersService.updateStatus(id, isActive).then(handleApiResponse),
		onSuccess: (data, variables) => {
			queryClient.setQueryData(usersKeys.detail(variables.id), data.user);
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		},
	});
}

// ── Use Delete User ─────────────────────────────────────────

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) =>
			usersService.delete(id).then(handleApiResponse),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
		},
	});
}
