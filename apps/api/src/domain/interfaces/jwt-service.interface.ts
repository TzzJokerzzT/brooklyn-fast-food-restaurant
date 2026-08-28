import type { TokenPayload } from "@/domain/entities/user.entity.js";

// ── JWT Service Interface ────────────────────────────────────
// Abstract contract for JWT token operations

export interface IJWTService {
	generateTokens(payload: TokenPayload): {
		accessToken: string;
		refreshToken: string;
	};
	verifyAccessToken(token: string): TokenPayload;
	verifyRefreshToken(token: string): TokenPayload;
}
