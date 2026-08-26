import type {
	CreateUserDTO,
	UpdateUserDTO,
	User,
} from "../entities/user.entity.js";

// ── Internal User (includes sensitive fields) ────────────────
export interface InternalUser extends User {
	password: string;
}

// ── User Repository Interface ────────────────────────────────
// Abstract contract for user data access

export interface IUserRepository {
	findById(id: number): Promise<InternalUser | null>;
	findByEmail(email: string): Promise<InternalUser | null>;
	findAll(options?: FindAllOptions): Promise<{ users: User[]; total: number }>;
	create(data: CreateUserDTO & { password: string }): Promise<User>;
	update(id: number, data: UpdateUserDTO): Promise<User>;
	delete(id: number): Promise<void>;
	updateLastLogin(id: number): Promise<void>;
}

export interface FindAllOptions {
	page?: number;
	limit?: number;
	roleId?: number;
	search?: string;
}
