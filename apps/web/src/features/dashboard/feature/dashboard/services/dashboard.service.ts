import apiClient from "@/src/shared/lib/axios";
import type { ApiResponse, MeResponse } from "@/src/shared/services";

// ── Dashboard Service ────────────────────────────────────────
// Endpoints para información del dashboard.

export const dashboardService = {
	async getUser(): Promise<ApiResponse<MeResponse>> {
		const { data } = await apiClient.get<ApiResponse<MeResponse>>("/auth/me");

		return data;
	},
};
