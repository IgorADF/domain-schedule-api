import type { AuthSeller } from "./auth-seller.ts";
import "fastify";
import type { ErrorSchema } from "../handlers/errors/schema.ts";

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

		DefaultSuccessSchema: z.ZodObject<{ success: z.ZodBoolean }>;
		DefaultErrorSchema: ErrorSchema;
	}

	interface FastifyRequest {
		authSeller: AuthSeller;
	}
}
