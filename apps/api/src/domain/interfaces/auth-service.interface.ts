import type { AuthTokens, TokenPayload, LoginDTO, RegisterDTO } from "../entities/user.entity.js";

// ── Auth Service Interface ───────────────────────────────────
// Abstract contract for authentication operations

export interface IAuthService {
  login(data: LoginDTO): Promise<AuthTokens>;
  register(data: RegisterDTO): Promise<AuthTokens>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateTokens(payload: TokenPayload): Promise<AuthTokens>;
}
