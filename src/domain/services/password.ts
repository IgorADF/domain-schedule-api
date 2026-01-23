export interface IPasswordService {
	hashPassword(password: string): string;
	comparePassword(password: string, hashedPassword: string): boolean;
}
