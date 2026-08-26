// ── User Entity ──────────────────────────────────────────────
// Core business entity - no external dependencies

export enum UserRole {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  CLIENTS = "clients",
}

export interface User {
  id: string;
  userName: string;
  lastName: string;
  email: string;
  role: UserRole;
  address: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  userName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  userName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  userName: string;
  lastName: string;
  email: string;
  role: UserRole;
  address: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
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
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// ── Helper Functions ─────────────────────────────────────────

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    userName: user.userName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    address: user.address,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}
