import { Envs } from "@/infra/envs/envs.js";
import { sequelizeConnection, testSchemaName } from "../connection.js";

if (Envs.NODE_ENV !== "test") {
	throw new Error(
		"Cannot run this setup because NODE_ENV is not set to 'test'",
	);
}

async function dropSchema() {
	await sequelizeConnection.dropSchema(testSchemaName, {});
}

export async function runInitTestDbConfigs() {
	const existingSchemas: unknown[] = await sequelizeConnection.showAllSchemas(
		{},
	);

	if ((existingSchemas as string[]).includes(testSchemaName)) {
		await dropSchema();
	}

	await sequelizeConnection.createSchema(testSchemaName, {});
	await sequelizeConnection.sync({ force: true });
}

export async function runFinalTestDbConfigs() {
	await dropSchema();
}
