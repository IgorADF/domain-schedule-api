import { dropRemainingTestSchemas } from "@/infra/database/helpers/test-running-functions.js";
import cron from "node-cron";

//At 12:00 PM every day
cron.schedule("* * * * *", async () => {
	await dropRemainingTestSchemas();
});

console.log("Jobs started");
