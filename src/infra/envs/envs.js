import { loadEnvFile } from "node:process";
import z from "zod";

loadEnvFile();

export const EnvsSchema = z.object({
	// General
	NODE_ENV: z.enum(["development", "production", "test"]),
	API_PORT: z.string().transform(Number),
	API_AUTH_JWT_SECRET: z.string(),
	API_REFRESH_JWT_SECRET: z.string(),
	API_JWT_RESET_SECRET: z.string(),

	// DB
	DB_NAME: z.string(),
	DB_USER: z.string(),
	DB_PASS: z.string(),
	DB_HOST: z.string(),
	DB_PORT: z.string().transform(Number),

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
});

const { success, data, error } = EnvsSchema.safeParse(process.env);

if (!success) {
	throw new Error(
		`❌ Invalid environment variables: ${JSON.stringify(z.treeifyError(error))}`,
	);
}

export const Envs = data;
