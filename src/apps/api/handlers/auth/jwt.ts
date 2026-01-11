import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";
import type { AuthSeller } from "../../@types/auth-seller.js";

type DefaultTokenProps = { iat: number; exp: number };

export function jwtVerify(
	token: string,
	secretOrPrivateKey: string,
	options?: VerifyOptions,
):
	| { payload: AuthSeller & DefaultTokenProps; error: false }
	| { payload: null; error: true } {
	try {
		const result = jwt.verify(token, secretOrPrivateKey, options);
		return { payload: result as AuthSeller & DefaultTokenProps, error: false };
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
