export interface IHashPasswordService {
	hashPassword(password: string): string;
	comparePassword(password: string, hashedPassword: string): boolean;
}
