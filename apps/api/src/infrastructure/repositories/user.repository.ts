import type {
	CreateUserDTO,
	UpdateUserDTO,
	User,
} from "@/domain/entities/user.entity.js";
import type {
	FindAllOptions,
	InternalUser,
	IUserRepository,
} from "@/domain/interfaces/user-repository.interface.js";
import { prisma } from "@/lib/prisma.js";

import type { Role as PrismaRole, User as PrismaUser } from "@prisma/client";

// ── Prisma User Repository ───────────────────────────────────
// Implements IUserRepository using Prisma ORM

function mapPrismaUser(user: PrismaUser & { role?: PrismaRole }): User {
	return {
		id: user.id,
		userName: user.userName,
		lastName: user.lastName,
		email: user.email,
		address: user.address,
		phoneNumber: user.phoneNumber,
		isActive: user.isActive,
		lastLoginAt: user.lastLoginAt,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		roleId: user.roleId,
		role: user.role ? { id: user.role.id, name: user.role.name } : undefined,
	};
}

function mapToInternalUser(
	user: PrismaUser & { role?: PrismaRole },
): InternalUser {
	return {
		...mapPrismaUser(user),
		password: user.password,
	};
}

export class UserRepository implements IUserRepository {
	async findById(id: number): Promise<InternalUser | null> {
		const user = await prisma.user.findUnique({
			where: { id },
			include: { role: true },
		});
		return user ? mapToInternalUser(user) : null;
	}

	async findByEmail(email: string): Promise<InternalUser | null> {
		const user = await prisma.user.findUnique({
			where: { email },
			include: { role: true },
		});
		return user ? mapToInternalUser(user) : null;
	}

	async findAll(
		options: FindAllOptions = {},
	): Promise<{ users: User[]; total: number }> {
		const { page = 1, limit = 10, roleId, search } = options;

		const where = {
			...(roleId && { roleId }),
			...(search && {
				OR: [
					{ userName: { contains: search } },
					{ lastName: { contains: search } },
					{ email: { contains: search } },
				],
			}),
		};

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				include: { role: true },
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.user.count({ where }),
		]);

		return { users: users.map(mapPrismaUser), total };
	}

	async create(data: CreateUserDTO & { password: string }): Promise<User> {
		const user = await prisma.user.create({
			data: {
				userName: data.userName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
				address: data.address,
				phoneNumber: data.phoneNumber,
				roleId: data.roleId || 3, // Default to clients role
			},
			include: { role: true },
		});
		return mapPrismaUser(user);
	}

	async update(id: number, data: UpdateUserDTO): Promise<User> {
		const user = await prisma.user.update({
			where: { id },
			data,
			include: { role: true },
		});
		return mapPrismaUser(user);
	}

	async delete(id: number): Promise<void> {
		await prisma.user.delete({ where: { id } });
	}

	async updateLastLogin(id: number): Promise<void> {
		await prisma.user.update({
			where: { id },
			data: { lastLoginAt: new Date() },
		});
	}
}
