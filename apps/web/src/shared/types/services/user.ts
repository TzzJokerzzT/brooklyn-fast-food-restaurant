// ── User Types ──────────────────────────────────────────────

export interface Role {
	id: number;
	name: string;
}

export interface UserResponse {
	id: number;
	userName: string;
	lastName: string;
	email: string;
	address: string | null;
	phoneNumber: string;
	isActive: boolean;
	lastLoginAt: string | null;
	createdAt: string;
	role?: Role;
}

// ── Auth DTOs ───────────────────────────────────────────────

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
	phoneNumber: string;
}

// ── Users DTOs ──────────────────────────────────────────────

export interface CreateUserDTO {
	userName: string;
	lastName: string;
	email: string;
	password: string;
	address?: string;
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

export interface FindAllUsersParams {
	page?: number;
	limit?: number;
	roleId?: number;
	search?: string;
}

export interface PaginatedUsers {
	users: UserResponse[];
	total: number;
	page: number;
	limit: number;
}

// ── Auth Response Shapes ────────────────────────────────────
// Tokens are in httpOnly cookies — not in response body

export interface LoginResponse {
	user: UserResponse;
}

export interface RegisterResponse {
	user: UserResponse;
}

export interface MeResponse {
	user: UserResponse;
}
