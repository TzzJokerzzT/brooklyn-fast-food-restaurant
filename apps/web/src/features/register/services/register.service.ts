import apiClient, { tokenStorage } from "@/src/shared/lib/axios";
import type {
	ApiResponse,
	RegisterDTO,
	RegisterResponse,
} from "@/src/shared/services";

export const registerService = {
	async register(dto: RegisterDTO): Promise<ApiResponse<RegisterResponse>> {
		const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(
			"/auth/register",
			dto,
		);

		if (data.success) {
			tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
		}

		return data;
	},
};
