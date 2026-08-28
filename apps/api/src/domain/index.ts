// Domain layer exports
// ── Entities ─────────────────────────────────────────────────

export type {
	CreateRoleDTO,
	Role as RoleEntity,
	UpdateRoleDTO,
} from "@/domain/entities/role.entity.js";
export { DEFAULT_ROLES, ROLE_NAMES } from "@/domain/entities/role.entity.js";
export type {
	AuthTokens,
	CreateUserDTO,
	LoginDTO,
	RegisterDTO,
	TokenPayload,
	UpdateUserDTO,
	User,
	UserResponse,
} from "@/domain/entities/user.entity.js";
export { toUserResponse } from "@/domain/entities/user.entity.js";
// ── Interfaces ───────────────────────────────────────────────
export type { IAuthService } from "@/domain/interfaces/auth-service.interface.js";
export type { IJWTService } from "@/domain/interfaces/jwt-service.interface.js";
export type { IPasswordService } from "@/domain/interfaces/password-service.interface.js";
export type { IRoleRepository } from "@/domain/interfaces/role-repository.interface.js";
export type {
	FindAllOptions,
	InternalUser,
	IUserRepository,
} from "@/domain/interfaces/user-repository.interface.js";
