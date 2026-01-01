import jwt, { type SignOptions, type SignPayloadType } from "@fastify/jwt";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { Envs } from "@/infra/envs/envs.js";
import type { AuthSeller } from "./@types/auth-seller.js";
import { errorHandler } from "./handlers/errors.js";
import { initRoutes } from "./routes/_init.js";

const fastifyInstance = Fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
}).withTypeProvider<ZodTypeProvider>();

fastifyInstance.setValidatorCompiler(validatorCompiler);
fastifyInstance.setSerializerCompiler(serializerCompiler);

fastifyInstance.setErrorHandler(errorHandler);

fastifyInstance.register(jwt, {
	secret: Envs.API_JWT_SECRET,
	sign: {
		expiresIn: "1h",
	},
});

fastifyInstance.decorateRequest("authSeller", null);

fastifyInstance.decorate(
	"authenticate",
	async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const decoded = await request.jwtDecode<AuthSeller>();
			request.authSeller = decoded;
		} catch (err: any) {
			reply
				.status(401)
				.send({ code: "Unauthorized", error: err?.message || "Invalid token" });
		}
	},
);

fastifyInstance.decorate(
	"jwtSign",
	async (payload: SignPayloadType, options?: Partial<SignOptions>) => {
		const token = fastifyInstance.jwt.sign(payload, options);
		return token;
	},
);

fastifyInstance.register(initRoutes);

function logInfoOnServer(message: string) {
	fastifyInstance.log.info(message);
}

export { fastifyInstance, logInfoOnServer };
