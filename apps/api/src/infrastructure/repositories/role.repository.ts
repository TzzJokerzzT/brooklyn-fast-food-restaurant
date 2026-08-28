import type {
	CreateRoleDTO,
	Role,
	UpdateRoleDTO,
} from "@/domain/entities/role.entity.js";
import type { IRoleRepository } from "@/domain/interfaces/role-repository.interface.js";
import { prisma } from "@/lib/prisma.js";

// ── Prisma Role Repository ───────────────────────────────────
// Implements IRoleRepository using Prisma ORM

function mapPrismaRole(role: { id: number; name: string }): Role {
	return {
		id: role.id,
		name: role.name,
	};
}

export class RoleRepository implements IRoleRepository {
	async findById(id: number): Promise<Role | null> {
		const role = await prisma.role.findUnique({ where: { id } });
		return role ? mapPrismaRole(role) : null;
	}

	async findByName(name: string): Promise<Role | null> {
		const role = await prisma.role.findUnique({ where: { name } });
		return role ? mapPrismaRole(role) : null;
	}

	async findAll(): Promise<Role[]> {
		const roles = await prisma.role.findMany();
		return roles.map(mapPrismaRole);
	}

	async create(data: CreateRoleDTO): Promise<Role> {
		const role = await prisma.role.create({
			data: { name: data.name },
		});
		return mapPrismaRole(role);
	}

	async update(id: number, data: UpdateRoleDTO): Promise<Role> {
		const role = await prisma.role.update({
			where: { id },
			data,
		});
		return mapPrismaRole(role);
	}

	async delete(id: number): Promise<void> {
		await prisma.role.delete({ where: { id } });
	}
}
