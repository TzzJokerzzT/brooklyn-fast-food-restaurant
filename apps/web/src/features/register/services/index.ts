import { authService } from "@/src/shared/services/auth.service";
import type {
	ApiResponse,
	RegisterDTO,
	RegisterResponse,
} from "@/src/shared/services/types";

// ── Register Service ──────────────────────────────────────
// Delegates to authService.register() which handles:
// - POST /auth/register with { userName, lastName, email, password, address }
// - Token storage on success

export const registerService = {
	async create(dto: RegisterDTO): Promise<ApiResponse<RegisterResponse>> {
		return await authService.register(dto);
	},
};
