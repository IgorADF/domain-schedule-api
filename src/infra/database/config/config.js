import { Envs } from "../../envs/envs.js";

/* For runtime code/db connection, this config file/format is not necessary */
/* Otherwise, this config file format integrates with and is used by Sequelize CLI */
/* Change type file if this was changed */

export default {
	development: {
		username: Envs.DB_USER,
		password: Envs.DB_PASS,
		database: Envs.DB_NAME,
		host: Envs.DB_HOST,
		port: Envs.DB_PORT,
		dialect: "postgres",
		seederStorage: "sequelize",
	},
	test: {
		username: Envs.DB_USER,
		password: Envs.DB_PASS,
		database: Envs.DB_NAME,
		host: Envs.DB_HOST,
		port: Envs.DB_PORT,
		dialect: "postgres",
		seederStorage: undefined,
	},
	production: {
		username: Envs.DB_USER,
		password: Envs.DB_PASS,
		database: Envs.DB_NAME,
		host: Envs.DB_HOST,
		port: Envs.DB_PORT,
		dialect: "postgres",
		seederStorage: "sequelize",
	},
};
