import apiClient from "@/src/shared/lib/axios";
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
		// No tokens to store — httpOnly cookies are set by backend on login
		return data;
	},
};
