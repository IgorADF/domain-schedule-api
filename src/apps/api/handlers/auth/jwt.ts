import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";

export function jwtVerify<T>(
	token: string,
	secretOrPrivateKey: string,
	options?: VerifyOptions,
): { payload: T; error: false } | { payload: null; error: true } {
	try {
		const result = jwt.verify(token, secretOrPrivateKey, options);
		return { payload: result as T, error: false };
	} catch {
		return { payload: null, error: true };
	}
}

export function jwtSign(
	payload: object,
	secretOrPrivateKey: string,
	options: SignOptions,
): string {
	return jwt.sign(payload, secretOrPrivateKey, options);
}
