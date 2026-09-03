// ── API Response Types ──────────────────────────────────────
// Shared types matching the backend Express response shapes

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface ApiError {
	success: false;
	message: string;
}

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

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
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

export interface LoginResponse {
	user: UserResponse;
	accessToken: string;
	refreshToken: string;
}

export interface RegisterResponse {
	user: UserResponse;
	accessToken: string;
	refreshToken: string;
}

export interface RefreshResponse {
	accessToken: string;
	refreshToken: string;
}

export interface MeResponse {
	user: UserResponse;
}
