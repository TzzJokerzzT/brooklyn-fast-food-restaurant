import type { LoginDTO, UserResponse } from "@/src/shared/services";
import { authService } from "@/src/shared/services";
import { handleApiResponse } from "@/src/shared/services/query-helpers";
import { useAuthStore } from "@/src/shared/store/auth.store";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// ── Query Keys ──────────────────────────────────────────────

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
};

// ── Use Me ──────────────────────────────────────────────────
// Fetches current user profile; returns null if not authenticated

export function useMe() {
	const setUser = useAuthStore((s) => s.setUser);

	return useQuery({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<UserResponse | null> => {
			try {
				const res = await authService.me();
				const user = handleApiResponse(res).user;
				setUser(user);
				return user;
			} catch {
				setUser(null);
				return null;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 min — user data changes rarely
	});
}

// ── Use Login ───────────────────────────────────────────────

export function useLogin() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation({
		mutationFn: (dto: LoginDTO) =>
			authService.login(dto).then(handleApiResponse),
		onSuccess: (data) => {
			setUser(data.user);
			queryClient.setQueryData(authKeys.me(), data.user);
			router.replace("/");
		},
	});
}

// ── Use Logout ──────────────────────────────────────────────

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const logout = useAuthStore((s) => s.logout);

	return async () => {
		// 1. Clear local state immediately
		logout();
		queryClient.clear();

		// 2. Notify backend to clear httpOnly cookies
		await authService.logout();

		// 3. Redirect after server confirms
		toast.success("Sesión cerrada", {
			description: "Has cerrado sesión correctamente",
		});
		router.replace("/");
	};
}
