import Fastify from "fastify";
import { initRoutes } from "./routes/_init.js";

const fastifyInstance = Fastify({
  logger: true,
});

fastifyInstance.register(initRoutes);

export { fastifyInstance };
