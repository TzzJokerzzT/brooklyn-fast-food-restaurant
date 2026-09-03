import { beforeEach, describe, expect, it } from "vitest";
import { UserRepository } from "../src/infrastructure/repositories/user.repository";
import { AuthService } from "../src/infrastructure/services/auth.service";
import { JWTService } from "../src/infrastructure/services/jwt.service";
import { PasswordService } from "../src/infrastructure/services/password.service";
import { prisma } from "./setup";

// ── Auth Service Tests ───────────────────────────────────────

describe("AuthService", () => {
	let userRepository: UserRepository;
	let passwordService: PasswordService;
	let jwtService: JWTService;
	let authService: AuthService;

	beforeEach(() => {
		userRepository = new UserRepository();
		passwordService = new PasswordService();
		jwtService = new JWTService();
		authService = new AuthService(userRepository, passwordService, jwtService);
	});

	// ── Register ────────────────────────────────────────────

	describe("register", () => {
		it("should register a new user successfully", async () => {
			const result = await authService.register({
				userName: "Test",
				lastName: "User",
				email: `test-register-${Date.now()}@example.com`,
				password: "Password123",
			});

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("email");
			expect(result).toHaveProperty("userName");
			expect(result.userName).toBe("Test");
		});

		it("should save user to database", async () => {
			const email = `test-db-${Date.now()}@example.com`;
			await authService.register({
				userName: "Test",
				lastName: "User",
				email,
				password: "Password123",
			});

			const user = await prisma.user.findUnique({ where: { email } });

			expect(user).not.toBeNull();
			expect(user?.userName).toBe("Test");
			expect(user?.lastName).toBe("User");
		});

		it("should hash the password", async () => {
			const email = `test-hash-${Date.now()}@example.com`;
			await authService.register({
				userName: "Test",
				lastName: "User",
				email,
				password: "Password123",
			});

			const user = await prisma.user.findUnique({ where: { email } });

			expect(user?.password).not.toBe("Password123");
			expect(user?.password).toMatch(/^\$2[aby]?\$\d{1,2}\$/);
		});

		it("should assign default client role", async () => {
			const email = `test-role-${Date.now()}@example.com`;
			await authService.register({
				userName: "Test",
				lastName: "User",
				email,
				password: "Password123",
			});

			const user = await prisma.user.findUnique({
				where: { email },
				include: { role: true },
			});

			expect(user?.roleId).toBeDefined();
			expect(user?.role).not.toBeNull();
		});

		it("should fail with duplicate email", async () => {
			const email = `test-dup-${Date.now()}@example.com`;
			await authService.register({
				userName: "Test",
				lastName: "User",
				email,
				password: "Password123",
			});

			await expect(
				authService.register({
					userName: "Test",
					lastName: "User",
					email,
					password: "Password123",
				}),
			).rejects.toThrow("Email already registered");
		});
	});

	// ── Login ───────────────────────────────────────────────

	describe("login", () => {
		const loginEmail = `test-login-${Date.now()}@example.com`;

		beforeEach(async () => {
			const hashedPassword = await passwordService.hash("Password123");
			await prisma.user.create({
				data: {
					userName: "Login",
					lastName: "Test",
					email: loginEmail,
					password: hashedPassword,
					roleId: 3,
				},
			});
		});

		it("should login with valid credentials", async () => {
			const result = await authService.login({
				email: loginEmail,
				password: "Password123",
			});

			expect(result).toHaveProperty("accessToken");
			expect(result).toHaveProperty("refreshToken");
		});

		it("should fail with wrong password", async () => {
			await expect(
				authService.login({
					email: loginEmail,
					password: "WrongPassword",
				}),
			).rejects.toThrow("Invalid credentials");
		});

		it("should fail with non-existent email", async () => {
			await expect(
				authService.login({
					email: `nonexistent-${Date.now()}@example.com`,
					password: "Password123",
				}),
			).rejects.toThrow("Invalid credentials");
		});

		it("should fail with inactive user", async () => {
			await prisma.user.update({
				where: { email: loginEmail },
				data: { isActive: false },
			});

			await expect(
				authService.login({
					email: loginEmail,
					password: "Password123",
				}),
			).rejects.toThrow("Account is deactivated");
		});
	});

	// ── Token Refresh ───────────────────────────────────────

	describe("refreshToken", () => {
		it("should refresh tokens with valid refresh token", async () => {
			await authService.register({
				userName: "Refresh",
				lastName: "Test",
				email: `test-refresh-${Date.now()}@example.com`,
				password: "Password123",
			});

			// Login to get tokens
			const loginResult = await authService.login({
				email: `test-refresh-${Date.now()}@example.com`,
				password: "Password123",
			});

			const newTokens = await authService.refreshToken(loginResult.refreshToken);

			expect(newTokens).toHaveProperty("accessToken");
			expect(newTokens).toHaveProperty("refreshToken");
			expect(typeof newTokens.accessToken).toBe("string");
			expect(typeof newTokens.refreshToken).toBe("string");
		});

		it("should fail with invalid refresh token", async () => {
			await expect(authService.refreshToken("invalid-token")).rejects.toThrow();
		});
	});

	// ── Password Hashing ────────────────────────────────────

	describe("password hashing", () => {
		it("should hash password", async () => {
			const hash = await authService.hashPassword("Password123");

			expect(hash).not.toBe("Password123");
			expect(hash).toMatch(/^\$2[aby]?\$\d{1,2}\$/);
		});

		it("should compare password correctly", async () => {
			const hash = await authService.hashPassword("Password123");

			const isValid = await authService.comparePassword("Password123", hash);
			expect(isValid).toBe(true);

			const isInvalid = await authService.comparePassword(
				"WrongPassword",
				hash,
			);
			expect(isInvalid).toBe(false);
		});
	});
});
