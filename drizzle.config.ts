import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!process.env.DATABASE_SCHEMA) {
	throw new Error("DATABASE_SCHEMA is not defined in environment variables");
}

export default defineConfig({
	out: "./src/infra/database/migrations",
	schema: "./src/infra/database/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	migrations: {
		table: "__drizzle_migrations",
		schema: process.env.DATABASE_SCHEMA,
	},
});
