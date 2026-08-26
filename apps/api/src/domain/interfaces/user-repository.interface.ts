import type { User, CreateUserDTO, UpdateUserDTO } from "../entities/user.entity.js";

// ── Internal User (includes sensitive fields) ────────────────
export interface InternalUser extends User {
  password: string;
  refreshToken: string | null;
}

// ── User Repository Interface ────────────────────────────────
// Abstract contract for user data access

export interface IUserRepository {
  findById(id: string): Promise<InternalUser | null>;
  findByEmail(email: string): Promise<InternalUser | null>;
  findAll(options?: FindAllOptions): Promise<{ users: User[]; total: number }>;
  create(data: CreateUserDTO & { password: string }): Promise<User>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}

export interface FindAllOptions {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}
