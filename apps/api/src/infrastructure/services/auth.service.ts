import type { IAuthService } from "../../domain/interfaces/auth-service.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import type { IPasswordService } from "../../domain/interfaces/password-service.interface.js";
import type { IJWTService } from "../../domain/interfaces/jwt-service.interface.js";
import type { LoginDTO, RegisterDTO, AuthTokens, TokenPayload } from "../../domain/entities/user.entity.js";
import { UserRole } from "../../domain/entities/user.entity.js";

// ── Auth Service ─────────────────────────────────────────────
// Implements IAuthService - coordinates auth operations

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private jwtService: IJWTService
  ) {}

  async login(data: LoginDTO): Promise<AuthTokens> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    return tokens;
  }

  async register(data: RegisterDTO): Promise<AuthTokens> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(data.password);

    // Create user with default role
    const user = await this.userRepository.create({
      userName: data.userName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      address: data.address,
      role: UserRole.CLIENTS,
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verifyRefreshToken(refreshToken);

      // Find user
      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new Error("Invalid refresh token");
      }

      // Check if refresh token matches stored one
      if (user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
      }

      // Generate new tokens
      const tokens = await this.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Store new refresh token
      await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAccessToken(token);
  }

  async hashPassword(password: string): Promise<string> {
    return this.passwordService.hash(password);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.compare(password, hash);
  }

  async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
