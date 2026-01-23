import { Envs } from "envs/envs.js";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "src/infra/database/prisma/schema.prisma",
	migrations: {
		path: "src/infra/database/prisma/migrations",
	},
	datasource: {
		// url: env("DATABASE_URL"),
		url: Envs.DATABASE_URL,
	},
	typedSql: {
		path: "src/infra/database/prisma/sql",
	},
});
