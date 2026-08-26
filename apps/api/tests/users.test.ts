import { UserRepository } from "@/infrastructure/repositories/user.repository";

import { beforeEach, describe, expect, it } from "vitest";

// ── User Repository Tests ────────────────────────────────────

describe("UserRepository", () => {
	let userRepository: UserRepository;

	beforeEach(() => {
		userRepository = new UserRepository();
	});

	describe("create", () => {
		it("should create a new user", async () => {
			const user = await userRepository.create({
				userName: "Test",
				lastName: "User",
				email: `test-create-${Date.now()}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});

			expect(user).toHaveProperty("id");
			expect(user.userName).toBe("Test");
			expect(user.lastName).toBe("User");
		});

		it("should assign default role when not specified", async () => {
			const user = await userRepository.create({
				userName: "Test",
				lastName: "User",
				email: `test-default-role-${Date.now()}@example.com`,
				password: "hashed-password",
			});

			expect(user.roleId).toBe(3);
		});
	});

	describe("findByEmail", () => {
		const email = `test-find-${Date.now()}@example.com`;

		beforeEach(async () => {
			await userRepository.create({
				userName: "Find",
				lastName: "Me",
				email,
				password: "hashed-password",
				roleId: 3,
			});
		});

		it("should find user by email", async () => {
			const user = await userRepository.findByEmail(email);

			expect(user).not.toBeNull();
			expect(user?.email).toBe(email);
			expect(user?.password).toBe("hashed-password");
		});

		it("should return null for non-existent email", async () => {
			const user = await userRepository.findByEmail(
				`nonexistent-${Date.now()}@example.com`,
			);

			expect(user).toBeNull();
		});
	});

	describe("findById", () => {
		it("should find user by id", async () => {
			const created = await userRepository.create({
				userName: "Find",
				lastName: "ById",
				email: `test-findid-${Date.now()}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});

			const user = await userRepository.findById(created.id);

			expect(user).not.toBeNull();
			expect(user?.id).toBe(created.id);
		});

		it("should return null for non-existent id", async () => {
			const user = await userRepository.findById(99999);

			expect(user).toBeNull();
		});
	});

	describe("update", () => {
		it("should update user fields", async () => {
			const created = await userRepository.create({
				userName: "Original",
				lastName: "Name",
				email: `test-update-${Date.now()}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});

			const updated = await userRepository.update(created.id, {
				userName: "Updated",
			});

			expect(updated.userName).toBe("Updated");
			expect(updated.lastName).toBe("Name");
		});
	});

	describe("delete", () => {
		it("should delete user", async () => {
			const created = await userRepository.create({
				userName: "Delete",
				lastName: "Me",
				email: `test-delete-${Date.now()}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});

			await userRepository.delete(created.id);

			const user = await userRepository.findById(created.id);
			expect(user).toBeNull();
		});
	});

	describe("findAll", () => {
		beforeEach(async () => {
			const ts = Date.now();
			await userRepository.create({
				userName: "Alice",
				lastName: "Smith",
				email: `alice-${ts}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});
			await userRepository.create({
				userName: "Bob",
				lastName: "Jones",
				email: `bob-${ts}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});
		});

		it("should return paginated users", async () => {
			const result = await userRepository.findAll({ page: 1, limit: 10 });

			expect(result.users.length).toBeGreaterThanOrEqual(2);
			expect(result.total).toBeGreaterThanOrEqual(2);
		});

		it("should filter by search term", async () => {
			const result = await userRepository.findAll({ search: "Alice" });

			expect(result.users.some((u) => u.userName === "Alice")).toBe(true);
		});
	});

	describe("updateLastLogin", () => {
		it("should update lastLoginAt timestamp", async () => {
			const created = await userRepository.create({
				userName: "Login",
				lastName: "Time",
				email: `test-login-time-${Date.now()}@example.com`,
				password: "hashed-password",
				roleId: 3,
			});

			await userRepository.updateLastLogin(created.id);

			const user = await userRepository.findById(created.id);
			expect(user?.lastLoginAt).not.toBeNull();
		});
	});
});
