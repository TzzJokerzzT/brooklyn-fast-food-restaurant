import type {
	LoginDTO,
	LoginResponse,
	RegisterDTO,
	RegisterResponse,
	UserResponse,
} from "@/src/shared/services";
import { authService } from "@/src/shared/services";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showToast } from "../components/Toast";

// ── Query Keys ──────────────────────────────────────────────

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
};

// ── Use Me ──────────────────────────────────────────────────
// Fetches current user profile; returns null if not authenticated

export function useMe() {
	return useQuery({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<UserResponse | null> => {
			try {
				const res = await authService.me();
				return handleApiResponse(res).user;
			} catch {
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

	return useMutation({
		mutationFn: (dto: LoginDTO) =>
			authService.login(dto).then(handleApiResponse),
		onSuccess: (data) => {
			queryClient.setQueryData(authKeys.me(), data.user);
			router.push("/");
		},
	});
}

// ── Use Register ────────────────────────────────────────────

export function useRegister() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (dto: RegisterDTO) =>
			authService.register(dto).then(handleApiResponse),
		onSuccess: (data) => {
			queryClient.setQueryData(authKeys.me(), data.user);
			router.push("/");
		},
	});
}

// ── Use Logout ──────────────────────────────────────────────

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return () => {
		authService.logout();
		queryClient.clear();
		router.push("/");
	};
}
