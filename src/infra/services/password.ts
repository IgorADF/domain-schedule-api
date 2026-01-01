import bcrypt from "bcryptjs";
import type { IPasswordService } from "@/domain/services/password.js";

export class PasswordService implements IPasswordService {
	comparePassword(password: string, hashedPassword: string): boolean {
		return bcrypt.compareSync(password, hashedPassword);
	}

	hashPassword(password: string): string {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	}
}
