import Fastify from "fastify";
import { initRoutes } from "./routes/_init.js";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

const fastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastifyInstance.setValidatorCompiler(validatorCompiler);
fastifyInstance.setSerializerCompiler(serializerCompiler);

fastifyInstance.register(initRoutes);

export { fastifyInstance };
