// ── User Entity ──────────────────────────────────────────────
// Core business entity - no external dependencies

export interface Role {
	id: number;
	name: string;
}

export interface User {
	id: number;
	userName: string;
	lastName: string;
	email: string;
	address: string | null;
	phoneNumber: string | null;
	isActive: boolean;
	lastLoginAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	roleId: number;
	role?: Role;
}

export interface CreateUserDTO {
	userName: string;
	lastName: string;
	email: string;
	password: string;
	address?: string;
	phoneNumber?: string;
	roleId?: number;
}

export interface UpdateUserDTO {
	userName?: string;
	lastName?: string;
	email?: string;
	address?: string;
	roleId?: number;
	isActive?: boolean;
}

export interface UserResponse {
	id: number;
	userName: string;
	lastName: string;
	email: string;
	address: string | null;
	phoneNumber: string | null;
	isActive: boolean;
	lastLoginAt: Date | null;
	createdAt: Date;
	role?: { id: number; name: string };
}

// ── Auth Entities ────────────────────────────────────────────

export interface LoginDTO {
	email: string;
	password: string;
}

export interface RegisterDTO {
	userName: string;
	lastName: string;
	email: string;
	password: string;
	address?: string;
	phoneNumber?: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface TokenPayload {
	userId: number;
	email: string;
	roleId: number;
}

// ── Helper Functions ─────────────────────────────────────────

export function toUserResponse(user: User): UserResponse {
	return {
		id: user.id,
		userName: user.userName,
		lastName: user.lastName,
		email: user.email,
		address: user.address,
		phoneNumber: user.phoneNumber,
		isActive: user.isActive,
		lastLoginAt: user.lastLoginAt,
		createdAt: user.createdAt,
		role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
	};
}
