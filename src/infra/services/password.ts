import bcrypt from "bcryptjs";
import type { IHashPasswordService } from "@/domain/services/password.js";

export class HashPasswordService implements IHashPasswordService {
	static create() {
		return new HashPasswordService();
	}

	comparePassword(password: string, hashedPassword: string): boolean {
		return bcrypt.compareSync(password, hashedPassword);
	}

	hashPassword(password: string): string {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	}
}
