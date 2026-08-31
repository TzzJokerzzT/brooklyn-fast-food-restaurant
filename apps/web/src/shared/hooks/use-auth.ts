import type {
	ApiResponse,
	LoginDTO,
	LoginResponse,
	RegisterDTO,
	RegisterResponse,
	UserResponse,
} from "@/src/shared/services";
import { authService } from "@/src/shared/services";

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
	return useQuery({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<UserResponse | null> => {
			try {
				const res = await authService.me();
				return res.success ? res.data.user : null;
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
		mutationFn: (dto: LoginDTO): Promise<ApiResponse<LoginResponse>> =>
			authService.login(dto),
		onSuccess: (data) => {
			if (data.success) {
				queryClient.setQueryData(authKeys.me(), data.data.user);
				router.push("/");
			}
		},
	});
}

// ── Use Register ────────────────────────────────────────────

export function useRegister() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (dto: RegisterDTO): Promise<ApiResponse<RegisterResponse>> =>
			authService.register(dto),
		onSuccess: (data) => {
			if (data.success) {
				queryClient.setQueryData(authKeys.me(), data.data.user);
				router.push("/");
			}
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
