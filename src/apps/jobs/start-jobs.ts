import cron from "node-cron";
import { dropRemainingTestSchemas } from "@/infra/database/helpers/test-running-functions.js";

//At 12:00 every day
cron.schedule("0 12 * * *", async () => {
	await dropRemainingTestSchemas();
});

console.log("Jobs started");
