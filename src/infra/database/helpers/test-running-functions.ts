import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { Envs } from "@/infra/envs/envs.js";
import { drizzleConnection } from "../connection.js";

const testSchemaPrefixName = "test-schema-";
const createTestSchemaName = () => testSchemaPrefixName + randomUUID();

function createTestUrl(baseDbUrl: string) {
	const url = new URL(baseDbUrl);
	const schemaName = createTestSchemaName();
	url.searchParams.set("schema", schemaName);

	return { url: url.toString(), schemaName };
}

function getSchemaNameFromUrl(dbUrl: string) {
	const url = new URL(dbUrl);
	const search = url.searchParams.get("schema");
	return search as string;
}

async function dropSchema(schemaName: string) {
	const statement = sql`drop schema ${schemaName} cascade`;
	await drizzleConnection.execute(statement);
}

function valiateTestEnv() {
	if (!Envs.isTestEnv) {
		throw new Error(
			"Cannot run this setup because NODE_ENV is not set to 'test'",
		);
	}
}

async function createSchema(schemaName: string) {
	try {
		const statement = sql.raw(`create schema "${schemaName}"`);
		await drizzleConnection.execute(statement);
	} catch (error) {
		throw new Error(
			`Error creating schema ${schemaName}: ${(error as Error).message}`,
		);
	}
}

function executeMigrationsCommansOnSchema(url: string) {
	process.env.DATABASE_URL = url;

	try {
		execSync("npx drizzle-kit migrate", {
			stdio: "inherit",
			cwd: process.cwd(),
		});
	} catch (error) {
		throw new Error(
			`Error executing migrations on test database schema: ${
				(error as Error).message
			}`,
		);
	}

	process.env.DATABASE_URL = Envs.DATABASE_URL;
}

export async function runInitTestDbConfigs() {
	valiateTestEnv();

	const connectionString = Envs.DATABASE_URL;

	const { url: testConnectionString, schemaName } =
		createTestUrl(connectionString);

	await createSchema(schemaName);
	executeMigrationsCommansOnSchema(testConnectionString);
	drizzleConnection.$client.options.connectionString = testConnectionString;
}

export async function runFinalTestDbConfigs() {
	valiateTestEnv();

	const schemaName = getSchemaNameFromUrl(
		drizzleConnection.$client.options.connectionString as string,
	);

	await dropSchema(schemaName);
}

/*****************************/

async function getAllSchemas() {
	const schemasToIgnore = `'public', 'drizzle', 'information_schema', 'pg_catalog', 'pg_toast'`;
	const statement = sql`select schema_name from information_schema.schemata where schema_name not in (${schemasToIgnore})`;
	const res = await drizzleConnection.execute(statement);
	return res.rows.map((row) => row.schema_name as string);
}

export async function dropRemainingTestSchemas() {
	const existingSchemas = await getAllSchemas();

	for (
		let indexSchemas = 0;
		indexSchemas < existingSchemas.length;
		indexSchemas++
	) {
		const schemaNameToDrop = existingSchemas[indexSchemas];

		if (schemaNameToDrop.indexOf(testSchemaPrefixName) === -1) {
			continue;
		}

		await dropSchema(schemaNameToDrop);
	}
}
