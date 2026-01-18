import "dotenv/config";
import { defineConfig, env } from "prisma/config";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined in environment variables");
}

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
