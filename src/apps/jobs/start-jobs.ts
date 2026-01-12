import cron from "node-cron";
import { dropRemainingTestSchemas } from "@/infra/database/helpers/test-running-functions.js";

//At 12:00 PM every day
cron.schedule("* * * * *", async () => {
	await dropRemainingTestSchemas();
});

console.log("Jobs started");
