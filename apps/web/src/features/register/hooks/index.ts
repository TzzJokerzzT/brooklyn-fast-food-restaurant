"use client";

import type { RegisterDTO } from "@/src/shared/services/types";
import { authService } from "@/src/shared/services/auth.service";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@/src/shared/hooks/use-auth";

// ── Use Register ──────────────────────────────────────────
// Calls authService.register() directly — no service wrapper needed.
// Token storage is handled by authService on success.

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
