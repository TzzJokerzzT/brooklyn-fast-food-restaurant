// Re-export types from their new location
export type { ApiError, ApiResponse } from "../types/services/api-response";
export type {
	PaginatedProducts,
	ProductResponse,
} from "../types/services/product";
export type {
	CreateUserDTO,
	FindAllUsersParams,
	LoginDTO,
	LoginResponse,
	MeResponse,
	PaginatedUsers,
	RegisterDTO,
	RegisterResponse,
	Role,
	UpdateUserDTO,
	UserResponse,
} from "../types/services/user";
export { authService } from "./auth.service";
export { ApiQueryError, handleApiResponse } from "./query-helpers";
export { usersService } from "./users.service";
