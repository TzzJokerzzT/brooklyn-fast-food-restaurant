import { apiClient } from "@/src/shared/lib/axios";

import type { ApiResponse, LoginDTO, LoginResponse, MeResponse } from "./types";

// ── Auth Service ────────────────────────────────────────────
// Handles authentication API calls.
// httpOnly cookies are managed by the backend — no client-side token handling.

export const authService = {
	async login(dto: LoginDTO): Promise<ApiResponse<LoginResponse>> {
		const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
			"/auth/login",
			dto,
		);
		// Backend sets httpOnly cookies — nothing to store on client
		return data;
	},

	async me(): Promise<ApiResponse<MeResponse>> {
		const { data } = await apiClient.get<ApiResponse<MeResponse>>("/auth/me");
		return data;
	},

	async logout(): Promise<void> {
		try {
			await apiClient.post("/auth/logout");
		} catch {
			// Ignore — cookies may already be cleared
		}
	},
};
