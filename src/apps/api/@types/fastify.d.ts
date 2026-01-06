import type { AuthSeller } from "./auth-seller.ts";
import "fastify";
import type { SignOptions, VerifyOptions } from "jsonwebtoken";

declare module "fastify" {
	interface FastifyInstance {
		jwtVerify: <T>(
			token: string,
			secretOrPrivateKey: string,
			options?: VerifyOptions,
		) => { payload: T; error: false } | { payload: null; error: true };

		jwtSign: (
			payload: object,
			secretOrPrivateKey: string,
			options: SignOptions,
		) => string;

		createCookie: (
			authTokenName: string,
			authTokenValue: string,
			maxAge: number,
		) => string;

		setSignTokensToReply: (
			reply: FastifyReply,
			payload: AuthSeller,
			authTokenData: { name: string; expireInSeconds: number },
			refreshTokenData: { name: string; expireInSeconds: number },
		) => void;

		setLogoutTokensToReply: (
			reply: FastifyReply,
			authTokenData: { name: string; expireInSeconds: number },
			refreshTokenData: { name: string; expireInSeconds: number },
		) => void;

		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;

		authTokenData: {
			name: string;
			expireInSeconds: number;
		};

		refreshTokenData: {
			name: string;
			expireInSeconds: number;
		};
	}

	interface FastifyRequest {
		authSeller: AuthSeller;
	}
}
