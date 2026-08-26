import jwt from "jsonwebtoken";
import type { IJWTService } from "../../domain/interfaces/jwt-service.interface.js";
import type { TokenPayload } from "../../domain/entities/user.entity.js";
import { env } from "../../lib/env.js";

// ── JWT Service ──────────────────────────────────────────────
// Implements IJWTService using jsonwebtoken

export class JWTService implements IJWTService {
  generateAccessToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: 900, // 15 minutes in seconds
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: 604800, // 7 days in seconds
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}
