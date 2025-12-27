import "fastify";
import { AuthSeller } from "./auth-seller.ts";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}

	interface FastifyRequest {
		authSeller: AuthSeller | null;
	}
}
