import { apiClient, tokenStorage } from "@/src/shared/lib/axios";

import type {
	ApiResponse,
	LoginDTO,
	LoginResponse,
	MeResponse,
	RefreshResponse,
} from "./types";

// ── Auth Service ────────────────────────────────────────────
// Handles authentication API calls and token persistence

export const authService = {
	async login(dto: LoginDTO): Promise<ApiResponse<LoginResponse>> {
		const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
			"/auth/login",
			dto,
		);

		if (data.success) {
			tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
		}

		return data;
	},

	async refresh(refreshToken: string): Promise<ApiResponse<RefreshResponse>> {
		const { data } = await apiClient.post<ApiResponse<RefreshResponse>>(
			"/auth/refresh",
			{ refreshToken },
		);

		if (data.success) {
			tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
		}

		return data;
	},

	async me(): Promise<ApiResponse<MeResponse>> {
		const { data } = await apiClient.get<ApiResponse<MeResponse>>("/auth/me");
		return data;
	},

	logout(): void {
		tokenStorage.clearTokens();
	},

	isAuthenticated(): boolean {
		return !!tokenStorage.getAccessToken();
	},
};
