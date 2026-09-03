import { DEFAULT_ROLES } from "@/domain/entities/role.entity.js";
import type {
	AuthTokens,
	LoginDTO,
	RegisterDTO,
	TokenPayload,
	User,
} from "@/domain/entities/user.entity.js";
import type { IAuthService } from "@/domain/interfaces/auth-service.interface.js";
import type { IJWTService } from "@/domain/interfaces/jwt-service.interface.js";
import type { IPasswordService } from "@/domain/interfaces/password-service.interface.js";
import type { IUserRepository } from "@/domain/interfaces/user-repository.interface.js";

// ── Auth Service ─────────────────────────────────────────────
// Handles authentication logic with dependency injection

export class AuthService implements IAuthService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly passwordService: IPasswordService,
		private readonly jwtService: IJWTService,
	) {}

	async login(data: LoginDTO): Promise<AuthTokens> {
		const user = await this.userRepository.findByEmail(data.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		if (!user.isActive) {
			throw new Error("Account is deactivated");
		}

		const isPasswordValid = await this.passwordService.compare(
			data.password,
			user.password,
		);
		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		await this.userRepository.updateLastLogin(user.id);

		const payload: TokenPayload = {
			userId: user.id,
			email: user.email,
			roleId: user.roleId,
		};

		return this.jwtService.generateTokens(payload);
	}

	async register(data: RegisterDTO): Promise<User> {
		const existingUser = await this.userRepository.findByEmail(data.email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		const hashedPassword = await this.passwordService.hash(data.password);

		const user = await this.userRepository.create({
			userName: data.userName,
			lastName: data.lastName,
			email: data.email,
			password: hashedPassword,
			address: data.address,
			phoneNumber: data.phoneNumber,
			roleId: DEFAULT_ROLES.CLIENTS,
		});

		return user;
	}

	async refreshToken(refreshToken: string): Promise<AuthTokens> {
		const payload = this.jwtService.verifyRefreshToken(refreshToken);

		const user = await this.userRepository.findById(payload.userId);
		if (!user?.isActive) {
			throw new Error("Invalid refresh token");
		}

		const newPayload: TokenPayload = {
			userId: user.id,
			email: user.email,
			roleId: user.roleId,
		};

		return this.jwtService.generateTokens(newPayload);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync JWT in async for interface compatibility
	async verifyAccessToken(token: string): Promise<TokenPayload> {
		return Promise.resolve(this.jwtService.verifyAccessToken(token));
	}

	async hashPassword(password: string): Promise<string> {
		return await this.passwordService.hash(password);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await this.passwordService.compare(password, hash);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync JWT in async for interface compatibility
	async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
		return Promise.resolve(this.jwtService.generateTokens(payload));
	}
}
