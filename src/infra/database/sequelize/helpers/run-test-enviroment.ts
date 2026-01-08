import { Envs } from "@/infra/envs/envs.js";
import { sequelizeConnection, testSchemaName } from "../connection.js";

if (Envs.NODE_ENV !== "test") {
	throw new Error(
		"Cannot run this setup because NODE_ENV is not set to 'test'",
	);
}

export async function runInitTestDbConfigs() {
	await sequelizeConnection.createSchema(testSchemaName, {});
	await sequelizeConnection.sync({ force: true });
}

export async function runFinalTestDbConfigs() {
	await sequelizeConnection.dropSchema(testSchemaName, {});
}
