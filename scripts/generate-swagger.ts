import { writeFileSync } from "node:fs";
import { createFastifyInstance } from "@/apps/api/server-config.js";
import { createDefaultDbClient } from "@/infra/database/prisma/helpers/create-client.js";

async function generateSwagger() {
	const { prisma: dbClient } = createDefaultDbClient();
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
