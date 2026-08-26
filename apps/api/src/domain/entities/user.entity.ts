// ── User Entity ──────────────────────────────────────────────
// Core business entity - no external dependencies

export enum UserRole {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  CLIENTS = "clients",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  email: string;
  name: string;
  password: string;
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
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}
