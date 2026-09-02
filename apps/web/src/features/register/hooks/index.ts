"use client";

import { useMutation } from "@tanstack/react-query";
import { registerService } from "../services";
import type { RegisterDTO, RegisterResponse } from "../types";
import type { ApiResponse } from "@/src/shared/services/types";

// ── Use Register ──────────────────────────────────────────
// Single mutation for user registration

export function useRegister() {
	return useMutation({
		mutationFn: (
			dto: RegisterDTO,
		): Promise<ApiResponse<RegisterResponse>> => registerService.create(dto),
	});
}
