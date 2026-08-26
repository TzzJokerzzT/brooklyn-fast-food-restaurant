// ── Password Service Interface ───────────────────────────────
// Abstract contract for password operations

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
