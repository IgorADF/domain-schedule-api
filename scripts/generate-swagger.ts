import { writeFileSync } from "node:fs";
import { createFastifyInstance } from "@/apps/api/server-config.js";
import { createDbClient } from "@/infra/database/prisma/helpers/create-client.js";
import { Envs } from "@/infra/envs/envs.js";

async function generateSwagger() {
	const { prisma: dbClient } = createDbClient(Envs.DATABASE_URL);
	const app = await createFastifyInstance(dbClient);

	await app.ready();

	const swagger = app.swagger();

	writeFileSync("./swagger.json", JSON.stringify(swagger, null, 2), "utf-8");

	console.log("✅ Swagger file generated: swagger.json");

	await app.close();
	await dbClient.$disconnect();
	process.exit(0);
}

generateSwagger();
