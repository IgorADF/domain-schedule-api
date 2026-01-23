import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "src/infra/database/prisma/schema.prisma",
	migrations: {
		path: "src/infra/database/prisma/migrations",
	},
	datasource: {
		// url: env("DATABASE_URL"),
		url: process.env.DATABASE_URL,
	},
	typedSql: {
		path: "src/infra/database/prisma/sql",
	},
});
