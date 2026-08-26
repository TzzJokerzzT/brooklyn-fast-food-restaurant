import type { TokenPayload } from "../entities/user.entity.js";

// ── JWT Service Interface ────────────────────────────────────
// Abstract contract for JWT operations

export interface IJWTService {
	generateAccessToken(payload: TokenPayload): string;
	generateRefreshToken(payload: TokenPayload): string;
	verifyAccessToken(token: string): TokenPayload;
	verifyRefreshToken(token: string): TokenPayload;
}
