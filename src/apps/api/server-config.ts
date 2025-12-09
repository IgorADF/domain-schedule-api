import Fastify from "fastify";
import { initRoutes } from "./routes/_init.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(initRoutes);

export { fastify };
