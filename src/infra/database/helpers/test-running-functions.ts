import { Envs } from "@/infra/envs/envs.js";
import { schemaName, sequelizeConnection } from "../connection.js";
import { testSchemaPrefixName } from "./test-schema-name.js";

async function dropSchema(_schemaName: string) {
	await sequelizeConnection.dropSchema(_schemaName, {});
}

export async function dropRemainingTestSchemas() {
	const existingSchemas: unknown[] = await sequelizeConnection.showAllSchemas(
		{},
	);

	for (
		let indexSchemas = 0;
		indexSchemas < (existingSchemas as string[]).length;
		indexSchemas++
	) {
		const schemaNameToDrop = (existingSchemas as string[])[indexSchemas];

		if (schemaNameToDrop.indexOf(testSchemaPrefixName) === -1) {
			continue;
		}

		await dropSchema(schemaNameToDrop);
	}
}

function valiateTestEnv() {
	if (!Envs.isTestEnv) {
		throw new Error(
			"Cannot run this setup because NODE_ENV is not set to 'test'",
		);
	}
}

export async function runInitTestDbConfigs() {
	valiateTestEnv();

	await sequelizeConnection.createSchema(schemaName as string, {});
	await sequelizeConnection.sync({ force: true });
}

export async function runFinalTestDbConfigs() {
	valiateTestEnv();

	await dropSchema(schemaName as string);
}
