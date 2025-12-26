import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { initRoutes } from "./routes/_init.js";
import { errorHandler } from "./handlers/errors.js";
import jwt from "@fastify/jwt";
import { Envs } from "@/core/envs/envs.js";
import { AuthSeller } from "./@types/auth-seller.js";

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

fastifyInstance.decorateRequest('authSeller', null)

fastifyInstance.decorate(
	"authenticate",
	async function (request: FastifyRequest, reply: FastifyReply) {
		try {
			const decoded = await request.jwtDecode<AuthSeller>();
			request.authSeller = decoded;
		} catch (err: any) {
			reply.status(401).send({ code: 'Unauthorized', error: err?.message || 'Invalid token' });
		}
	},
);

fastifyInstance.register(initRoutes);

export { fastifyInstance };
