import { execSync } from "node:child_process";
import { sequelizeConnection } from "../connection.js";

export async function createTestSchema() {
	const schemaName = "test_schema_" + Date.now();
	await sequelizeConnection.createSchema(schemaName, {});
}

export async function dropTestSchema(schemaName: string) {
	await sequelizeConnection.dropSchema(schemaName, {});
}

export function executeMigration() {
	execSync("npm run db:migrate");
}

export async function runInitTestDbConfigs() {
	const schemaName = createTestSchema();
}
