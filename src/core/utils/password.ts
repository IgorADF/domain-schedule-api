import bcrypt from "bcryptjs";

export function comparePasswords(
  rawPassword: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(rawPassword, hashedPassword);
}

export function hashPassword(rawPassword: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(rawPassword, salt);
}
