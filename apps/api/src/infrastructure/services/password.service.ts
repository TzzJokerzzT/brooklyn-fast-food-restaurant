import type { IPasswordService } from "@/domain/interfaces/password-service.interface.js";

import bcrypt from "bcrypt";

// ── Password Service ─────────────────────────────────────────
// Handles password hashing and comparison

export class PasswordService implements IPasswordService {
	private readonly saltRounds = 12;

	async hash(password: string): Promise<string> {
		return await bcrypt.hash(password, this.saltRounds);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
