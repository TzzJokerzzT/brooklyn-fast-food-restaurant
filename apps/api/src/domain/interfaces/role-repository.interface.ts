import type {
	CreateRoleDTO,
	Role,
	UpdateRoleDTO,
} from "../entities/role.entity.js";

// ── Role Repository Interface ────────────────────────────────
// Abstract contract for role data access

export interface IRoleRepository {
	findById(id: number): Promise<Role | null>;
	findByName(name: string): Promise<Role | null>;
	findAll(): Promise<Role[]>;
	create(data: CreateRoleDTO): Promise<Role>;
	update(id: number, data: UpdateRoleDTO): Promise<Role>;
	delete(id: number): Promise<void>;
}
