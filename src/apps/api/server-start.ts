import { authenticateDbConnection } from "../../core/database/connection.js";
import { Envs } from "../../core/envs/envs.js";
import { fastifyInstance } from "./server-config.js";

try {
  await authenticateDbConnection();
  await fastifyInstance.listen({ port: Envs.API_PORT });
} catch (err) {
  fastifyInstance.log.error(err);
  process.exit(1);
}
