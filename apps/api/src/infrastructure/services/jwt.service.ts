import type { TokenPayload } from "@/domain/entities/user.entity.js";
import type { IJWTService } from "@/domain/interfaces/jwt-service.interface.js";
import { env } from "@/lib/env.js";

import jwt from "jsonwebtoken";

// ── JWT Service ──────────────────────────────────────────────
// Handles token generation and verification

export class JWTService implements IJWTService {
	generateTokens(payload: TokenPayload): {
		accessToken: string;
		refreshToken: string;
	} {
		const accessToken = jwt.sign(
			{ userId: payload.userId, email: payload.email, roleId: payload.roleId },
			env.JWT_ACCESS_SECRET,
			{ expiresIn: env.JWT_ACCESS_EXPIRATION as unknown as number },
		);

		const refreshToken = jwt.sign(
			{ userId: payload.userId, email: payload.email, roleId: payload.roleId },
			env.JWT_REFRESH_SECRET,
			{ expiresIn: env.JWT_REFRESH_EXPIRATION as unknown as number },
		);

		return { accessToken, refreshToken };
	}

	verifyAccessToken(token: string): TokenPayload {
		const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
		return {
			userId: decoded.userId,
			email: decoded.email,
			roleId: decoded.roleId,
		};
	}

	verifyRefreshToken(token: string): TokenPayload {
		const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
		return {
			userId: decoded.userId,
			email: decoded.email,
			roleId: decoded.roleId,
		};
	}
}
