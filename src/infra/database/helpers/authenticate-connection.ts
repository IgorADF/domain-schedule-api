import { drizzleConnection } from "../connection.js";

export async function authenticateDbConnection(
	logInfoCallback: (msg: string) => void,
) {
	await drizzleConnection.$client.connect();
	logInfoCallback("Database connection has been established successfully.");
}
