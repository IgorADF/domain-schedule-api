import type { ModelOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { logInfoOnServer } from "@/apps/api/server-config.js";
import { Envs } from "../envs/envs.js";
import config from "./config/config.js";
import type { SequelizeConfigType } from "./config/config-type.js";
import { loadAllModels } from "./helpers/auto-load-models.js";

const connectionConfig = config[Envs.NODE_ENV] as
	| SequelizeConfigType
	| undefined;

if (!connectionConfig) {
	throw new Error("Unable to find database configuration");
}

const { dialect, database, username, password, host, port } = connectionConfig;

export const testSchemaName = "test-schema";

async function createSequelizeConnection() {
	const models = await loadAllModels();

	const defaultModelsConfig: ModelOptions = {
		timestamps: false,
		schema: Envs.isTestEnv ? testSchemaName : undefined,
	};

	if (!Envs.isTestEnv && defaultModelsConfig.schema === testSchemaName) {
		throw new Error("Cannot use test schema name in non-test environment");
	}

	return new Sequelize({
		dialect,
		database,
		username,
		password,
		host,
		port,
		models,
		logging: (msg) => logInfoOnServer(msg),
		repositoryMode: true,
		schema: defaultModelsConfig.schema,
		define: defaultModelsConfig,
	});
}

export const sequelizeConnection = await createSequelizeConnection();
