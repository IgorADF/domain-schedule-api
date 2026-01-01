import { Sequelize } from "sequelize-typescript";
import { logInfoOnServer } from "@/apps/api/server-config.js";
import { Envs } from "../envs/envs.js";
import config from "./config/config.js";
import type { SequelizeConfigType } from "./config/config-type.js";

const connectionConfig = config[Envs.NODE_ENV] as
	| SequelizeConfigType
	| undefined;

if (!connectionConfig) {
	throw new Error("Unable to find database configuration");
}

const { dialect, database, username, password, host, port } = connectionConfig;

export function createSequelizeConnection() {
	const modelsPath = `${import.meta.dirname}/models`;

	return new Sequelize({
		dialect,
		database,
		username,
		password,
		host,
		port,
		models: [modelsPath],
		logging: (msg) => logInfoOnServer(msg),
		repositoryMode: true,
	});
}

export const sequelizeConnection = createSequelizeConnection();

export async function authenticateDbConnection(
	logInfoCallback: (msg: string) => void,
) {
	await sequelizeConnection.authenticate();
	logInfoCallback("Database connection has been established successfully.");
}

export function closeDbConnection(connection: Sequelize) {
	return connection.close();
}
