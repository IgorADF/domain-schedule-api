import "fastify";
import type { AuthSeller } from "./auth-seller.ts";
import type { SignOptions, SignPayloadType } from "@fastify/jwt";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;

		jwtSign: (
			payload: SignPayloadType,
			options?: Partial<SignOptions>,
		) => Promise<string>;
	}

	interface FastifyRequest {
		authSeller: AuthSeller | null;
	}
}
