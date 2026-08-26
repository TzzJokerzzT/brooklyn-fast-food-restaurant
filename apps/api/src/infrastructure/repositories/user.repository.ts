import { PrismaClient, type User as PrismaUser } from "@prisma/client";
import type {
  IUserRepository,
  FindAllOptions,
  InternalUser,
} from "../../domain/interfaces/user-repository.interface.js";
import type { User, CreateUserDTO, UpdateUserDTO } from "../../domain/entities/user.entity.js";
import { UserRole } from "../../domain/entities/user.entity.js";

// ── Prisma User Repository ───────────────────────────────────
// Implements IUserRepository using Prisma ORM

const prisma = new PrismaClient();

function mapPrismaUser(user: PrismaUser): User {
  return {
    id: user.id,
    userName: user.userName,
    lastName: user.lastName,
    email: user.email,
    role: user.role as UserRole,
    address: user.address,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function mapToInternalUser(user: PrismaUser): InternalUser {
  return {
    ...mapPrismaUser(user),
    password: user.password,
    refreshToken: user.refreshToken,
  };
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<InternalUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? mapToInternalUser(user) : null;
  }

  async findByEmail(email: string): Promise<InternalUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? mapToInternalUser(user) : null;
  }

  async findAll(options: FindAllOptions = {}): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, role, search } = options;

    const where = {
      ...(role && { role }),
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
        role: data.role || UserRole.CLIENTS,
      },
    });
    return mapPrismaUser(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return mapPrismaUser(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
