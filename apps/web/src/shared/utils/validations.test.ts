import { describe, expect, it } from "vitest";
import {
	validateEmail,
	validateName,
	validatePassword,
	validatePasswordConfirm,
} from "./validations";

// ── validateEmail ────────────────────────────────────────────

describe("validateEmail", () => {
	it("returns invalid for empty string", () => {
		const result = validateEmail("");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Email es requerido");
	});

	it("returns invalid for whitespace-only string", () => {
		const result = validateEmail("   ");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Email es requerido");
	});

	it("returns invalid for malformed email", () => {
		const result = validateEmail("not-an-email");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Formato de email invalido");
	});

	it("returns invalid for email without domain", () => {
		const result = validateEmail("user@");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Formato de email invalido");
	});

	it("returns invalid for email without TLD", () => {
		const result = validateEmail("user@domain");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Formato de email invalido");
	});

	it("returns valid for correct email", () => {
		const result = validateEmail("user@example.com");
		expect(result.valid).toBe(true);
		expect(result.message).toBe("");
	});
});

// ── validatePassword ─────────────────────────────────────────

describe("validatePassword", () => {
	it("returns invalid for empty string", () => {
		const result = validatePassword("");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Password is required");
	});

	it("returns invalid for password shorter than 6 chars", () => {
		const result = validatePassword("Ab1");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Password must be at least 6 characters");
	});

	it("returns invalid when no uppercase letter", () => {
		const result = validatePassword("abcdef1");
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Password must contain at least one uppercase letter",
		);
	});

	it("returns invalid when no number", () => {
		const result = validatePassword("Abcdef");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Password must contain at least one number");
	});

	it("returns valid for password meeting all requirements", () => {
		const result = validatePassword("Abcdef1");
		expect(result.valid).toBe(true);
		expect(result.message).toBe("");
	});
});

// ── validatePasswordConfirm ──────────────────────────────────

describe("validatePasswordConfirm", () => {
	it("returns invalid for empty confirm", () => {
		const result = validatePasswordConfirm("Abcdef1", "");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Please confirm your password");
	});

	it("returns invalid when passwords do not match", () => {
		const result = validatePasswordConfirm("Abcdef1", "Abcdef2");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Passwords do not match");
	});

	it("returns valid when passwords match", () => {
		const result = validatePasswordConfirm("Abcdef1", "Abcdef1");
		expect(result.valid).toBe(true);
		expect(result.message).toBe("");
	});
});

// ── validateName ─────────────────────────────────────────────

describe("validateName", () => {
	it("returns invalid for empty string", () => {
		const result = validateName("");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Name is required");
	});

	it("returns invalid for whitespace-only string", () => {
		const result = validateName("   ");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Name is required");
	});

	it("returns invalid for single character", () => {
		const result = validateName("A");
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Name must be at least 2 characters");
	});

	it("returns valid for two characters", () => {
		const result = validateName("Ab");
		expect(result.valid).toBe(true);
		expect(result.message).toBe("");
	});

	it("uses custom label in messages", () => {
		const emptyResult = validateName("", "First Name");
		expect(emptyResult.message).toBe("First Name is required");

		const shortResult = validateName("A", "First Name");
		expect(shortResult.message).toBe(
			"First Name must be at least 2 characters",
		);
	});
});
