import type { ModelOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Envs } from "../envs/envs.js";
import config from "./config/config.js";
import type { SequelizeConfigType } from "./config/config-type.js";
import { loadAllModels } from "./helpers/auto-load-models.js";
import { createTestSchemaName } from "./helpers/test-schema-name.js";

const connectionConfig = config[Envs.NODE_ENV] as
	| SequelizeConfigType
	| undefined;

if (!connectionConfig) {
	throw new Error("Unable to find database configuration");
}

const { dialect, database, username, password, host, port } = connectionConfig;

export const schemaName = Envs.isTestEnv ? createTestSchemaName() : undefined;

async function createSequelizeConnection() {
	const models = await loadAllModels();

	const defaultModelsConfig: ModelOptions = {
		timestamps: false,
		schema: schemaName,
	};

	return new Sequelize({
		dialect,
		database,
		username,
		password,
		host,
		port,
		models,
		logging: (msg) => {
			console.info(msg);
		},
		repositoryMode: true,
		schema: defaultModelsConfig.schema,
		define: defaultModelsConfig,
	});
}

export const sequelizeConnection = await createSequelizeConnection();
