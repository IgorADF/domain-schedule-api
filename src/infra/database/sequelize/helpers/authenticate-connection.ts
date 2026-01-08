import { sequelizeConnection } from "../connection.js";

export async function authenticateDbConnection(
	logInfoCallback: (msg: string) => void,
) {
	await sequelizeConnection.authenticate();
	logInfoCallback("Database connection has been established successfully.");
}
