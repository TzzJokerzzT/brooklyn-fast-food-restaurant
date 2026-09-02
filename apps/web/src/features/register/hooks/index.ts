"use client";

import { showToast } from "@/src/shared/components/Toast";
import { authKeys } from "@/src/shared/hooks/use-auth";
import { authService } from "@/src/shared/services/auth.service";
import { handleApiResponse } from "@/src/shared/services/query-helpers";
import type { RegisterDTO } from "@/src/shared/services/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
			showToast("Usuario creado exitosamente", "success");
			router.push("/");
		},
		onError: (error) => {
			showToast(error.message || "Error al crear el usuario", "error");
		},
	});
}
