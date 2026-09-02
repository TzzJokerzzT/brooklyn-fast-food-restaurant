// ── Validation Helpers ──────────────────────────────────────
// Pure functions for client-side form validation.
// Rules match the backend Zod schemas in validation.middleware.ts

export interface ValidationResult {
	valid: boolean;
	message: string;
}

// ── Email ───────────────────────────────────────────────────

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
	if (!email.trim()) {
		return { valid: false, message: "Email es requerido" };
	}
	if (!EMAIL_REGEX.test(email)) {
		return { valid: false, message: "Formato de email invalido" };
	}
	return { valid: true, message: "" };
}

// ── Password ────────────────────────────────────────────────
// Rules: min 6 chars, at least 1 uppercase, at least 1 number

export function validatePassword(password: string): ValidationResult {
	if (!password) {
		return { valid: false, message: "Password is required" };
	}
	if (password.length < 6) {
		return {
			valid: false,
			message: "Password must be at least 6 characters",
		};
	}
	if (!/[A-Z]/.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one uppercase letter",
		};
	}
	if (!/[0-9]/.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one number",
		};
	}
	return { valid: true, message: "" };
}

// ── Password Confirmation ───────────────────────────────────

export function validatePasswordConfirm(
	password: string,
	confirm: string,
): ValidationResult {
	if (!confirm) {
		return { valid: false, message: "Please confirm your password" };
	}
	if (password !== confirm) {
		return { valid: false, message: "Passwords do not match" };
	}
	return { valid: true, message: "" };
}

// ── Name ────────────────────────────────────────────────────

export function validateName(name: string, label = "Name"): ValidationResult {
	if (!name.trim()) {
		return { valid: false, message: `${label} is required` };
	}
	if (name.trim().length < 2) {
		return {
			valid: false,
			message: `${label} must be at least 2 characters`,
		};
	}
	return { valid: true, message: "" };
}
