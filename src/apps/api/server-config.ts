import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { initRoutes } from "./routes/_init.js";

const fastifyInstance = Fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastifyInstance.setValidatorCompiler(validatorCompiler);
fastifyInstance.setSerializerCompiler(serializerCompiler);

fastifyInstance.register(initRoutes);

export { fastifyInstance };
