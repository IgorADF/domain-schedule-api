// import "dotenv/config";
import { loadEnvFile } from "node:process";
import z from "zod";

loadEnvFile();

export const EnvsSchema = z.object({
	// General
	NODE_ENV: z.enum(["development", "production", "test"]),
	API_PORT: z.string().transform(Number),
	API_JWT_SECRET: z.string(),

	// DB
	DB_NAME: z.string(),
	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_HOST: z.string(),
	DB_PORT: z.string().transform(Number),

	REDIS_ENABLE: z.string().transform((val) => val === "true"),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.string().transform(Number),

	// Queue
	URL_AMQP: z.url(),
});

const { success, data, error } = EnvsSchema.safeParse(process.env);

if (!success) {
	throw new Error(
		`❌ Invalid environment variables: ${JSON.stringify(z.treeifyError(error))}`,
	);
}

export const Envs = data;
