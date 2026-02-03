import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Envs } from "@/infra/envs/envs.js";
import { getSchemas } from "../_generated/sql/getSchemas.js";
import type { MyPrismaClient } from "../types.js";
import { createDbClient } from "./create-client.js";
import { setSchemaSearchParamToUrl } from "./schema-database-url.js";

const testSchemaPrefixName = "test-schema-";

async function dropSchema(prismaClient: MyPrismaClient, schemaName: string) {
	try {
		await prismaClient.$executeRawUnsafe(
			`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
		);
	} catch (error) {
		throw new Error(
			`Error dropping test database schema ${schemaName}: ${
				(error as Error).message
			}`,
		);
	}
}

export class TestDatabaseHelper {
	prismaClient: MyPrismaClient;
	private originalDatabaseUrl: string;
	private testDatabaseUrl: string;
	private testSchemaName: string;

	constructor() {
		this.validateTestEnv();

		this.originalDatabaseUrl = Envs.DATABASE_URL;

		const { url, schemaName } = this.createTestUrl(this.originalDatabaseUrl);
		this.testDatabaseUrl = url;
		this.testSchemaName = schemaName;

		this.prismaClient = createDbClient(this.testDatabaseUrl).prisma;
	}

	private createTestSchemaName = () => testSchemaPrefixName + randomUUID();

	private createTestUrl(baseDbUrl: string) {
		const schemaName = this.createTestSchemaName();
		const { url } = setSchemaSearchParamToUrl(baseDbUrl, schemaName);
		return { url, schemaName };
	}

	private validateTestEnv() {
		if (!Envs.isTestEnv) {
			throw new Error(
				"Cannot run this setup because NODE_ENV is not set to 'test'",
			);
		}
	}

	private executeMigrationsCommansOnSchema(url: string) {
		try {
			execSync("npm run db:migrate:deploy", {
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
	}

	async run() {
		this.validateTestEnv();

		process.env.DATABASE_URL = this.testDatabaseUrl;

		await this.prismaClient.$connect();
		this.executeMigrationsCommansOnSchema(this.testDatabaseUrl);
	}

	async close() {
		this.validateTestEnv();

		await dropSchema(this.prismaClient, this.testSchemaName);
		await this.prismaClient.$disconnect();

		process.env.DATABASE_URL = this.originalDatabaseUrl;
	}
}

export class CleanupTestSchemasHelper {
	constructor(private readonly prismaClient: MyPrismaClient) {}

	private async getAllSchemas() {
		const res = await this.prismaClient.$queryRawTyped(getSchemas());
		return res.map((schema) => schema.schema_name as string);
	}

	async run() {
		const existingSchemas = await this.getAllSchemas();

		for (
			let indexSchemas = 0;
			indexSchemas < existingSchemas.length;
			indexSchemas++
		) {
			const schemaNameToDrop = existingSchemas[indexSchemas];

			if (schemaNameToDrop.indexOf(testSchemaPrefixName) === -1) {
				continue;
			}

			await dropSchema(this.prismaClient, schemaNameToDrop);
		}
	}
}
