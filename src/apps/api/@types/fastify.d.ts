import type { AuthSeller } from "./auth-seller.ts";
import "fastify";

declare module "fastify" {
	interface FastifyInstance {
		createAuthCookie: (
			authTokenName: string,
			authTokenValue: string,
			maxAge: number,
		) => string;

		setSignTokensToReply: (reply: FastifyReply, payload: AuthSeller) => void;

		setLogoutTokensToReply: (reply: FastifyReply) => void;

		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}

	interface FastifyRequest {
		authSeller: AuthSeller;
	}
}
