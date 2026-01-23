import cron from "node-cron";
import { createDefaultDbClient } from "@/infra/database/prisma/helpers/create-client.js";
import { CleanupTestSchemasHelper } from "@/infra/database/prisma/helpers/test-enviroment.js";

//At 12:00 every day
cron.schedule("0 12 * * *", async () => {
	const dbClient = await createDefaultDbClient();
	const cleanupHelper = new CleanupTestSchemasHelper(dbClient.prisma);
	await cleanupHelper.run();
});

console.log("Jobs started");
