import { beforeEach, describe, expect, it } from "vitest";
import type { UserResponse } from "../types/services/user";
import { useAuthStore } from "./auth.store";

const mockUser: UserResponse = {
	id: 1,
	userName: "John",
	lastName: "Doe",
	email: "john@example.com",
	address: null,
	phoneNumber: "1234567890",
	isActive: true,
	lastLoginAt: null,
	createdAt: "2025-01-01T00:00:00.000Z",
};

beforeEach(() => {
	useAuthStore.setState({ isAuthenticated: false, user: null });
	sessionStorage.clear();
});

// ── Initial state ────────────────────────────────────────────

describe("auth store initial state", () => {
	it("is not authenticated by default", () => {
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
	});

	it("has null user by default", () => {
		expect(useAuthStore.getState().user).toBeNull();
	});
});

// ── setUser ──────────────────────────────────────────────────

describe("setUser", () => {
	it("sets user and marks as authenticated", () => {
		useAuthStore.getState().setUser(mockUser);

		const state = useAuthStore.getState();
		expect(state.user).toEqual(mockUser);
		expect(state.isAuthenticated).toBe(true);
	});

	it("sets user to null and marks as unauthenticated", () => {
		useAuthStore.getState().setUser(mockUser);
		useAuthStore.getState().setUser(null);

		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});
});

// ── logout ───────────────────────────────────────────────────

describe("logout", () => {
	it("clears user and sets isAuthenticated to false", () => {
		useAuthStore.getState().setUser(mockUser);
		useAuthStore.getState().logout();

		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});

	it("is safe to call when already logged out", () => {
		useAuthStore.getState().logout();

		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});
});

// ── setAuthenticated ─────────────────────────────────────────

describe("setAuthenticated", () => {
	it("sets isAuthenticated to true independently", () => {
		useAuthStore.getState().setAuthenticated(true);

		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(useAuthStore.getState().user).toBeNull();
	});

	it("sets isAuthenticated to false independently", () => {
		useAuthStore.getState().setUser(mockUser);
		useAuthStore.getState().setAuthenticated(false);

		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(useAuthStore.getState().user).toEqual(mockUser);
	});
});
