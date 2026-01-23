import path from "node:path";
import { config } from "dotenv";
import z from "zod";

let envFilePath = "/.env";
if (process.env.NODE_ENV === "test") {
	envFilePath = "/.env.test";
}

const fullEnvPath = path.join(process.cwd(), envFilePath);
config({ path: fullEnvPath });

export const EnvsSchema = z
	.object({
		// General
		NODE_ENV: z.enum(["development", "production", "test"]),
		API_PORT: z.string().transform(Number),
		API_AUTH_JWT_SECRET: z.string(),
		API_REFRESH_JWT_SECRET: z.string(),
		API_JWT_RESET_SECRET: z.string(),
		CORS_ORIGINS: z.string(),

		// DB
		DATABASE_URL: z.url(),

		REDIS_ENABLE: z.string().transform((val) => val === "true"),
		REDIS_HOST: z.string(),
		REDIS_PORT: z.string().transform(Number),

		// Queue
		RABBITMQ_HOST: z.string(),
		RABBITMQ_PORT: z.string().transform(Number),
		RABBITMQ_USER: z.string(),
		RABBITMQ_PASS: z.string(),
		RABBITMQ_MANAGEMENT_PORT: z.string().transform(Number),

		//Email
		SMTP_HOST: z.string(),
		SMTP_PORT: z.string().transform(Number),
		SMTP_USER: z.string(),
		SMTP_PASS: z.string(),
		EMAIL_FROM: z.string(),
	})
	.transform((envs) => ({
		...envs,
		isDevEnv: envs.NODE_ENV === "development",
		isProdEnv: envs.NODE_ENV === "production",
		isTestEnv: envs.NODE_ENV === "test",
	}));

const { success, data, error } = EnvsSchema.safeParse(process.env);

if (!success) {
	throw new Error(
		`❌ Invalid environment variables: ${JSON.stringify(z.treeifyError(error))}`,
	);
}

export const Envs = data;
