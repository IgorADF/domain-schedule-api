import cron from "node-cron";
import { createDbClient } from "@/infra/database/helpers/create-client.js";
import { CleanupTestSchemasHelper } from "@/infra/database/helpers/test-enviroment.js";
import { Envs } from "@/infra/envs/envs.js";

//At 12:00 every day
cron.schedule("0 12 * * *", async () => {
	const dbClient = await createDbClient(Envs.DATABASE_URL);
	const cleanupHelper = new CleanupTestSchemasHelper(dbClient.prisma);
	await cleanupHelper.run();
});

console.log("Jobs started");
