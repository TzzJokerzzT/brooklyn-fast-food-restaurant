import bcrypt from "bcrypt";
import type { IPasswordService } from "../../domain/interfaces/password-service.interface.js";

// ── Bcrypt Password Service ──────────────────────────────────
// Implements IPasswordService using bcrypt

const SALT_ROUNDS = 12;

export class PasswordService implements IPasswordService {
	async hash(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}
