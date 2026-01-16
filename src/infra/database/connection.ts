import { drizzle } from "drizzle-orm/node-postgres";
import { Envs } from "../envs/envs.js";
import { relations } from "./relations.js";

async function createDrizzleConnection() {
	const connectionString = Envs.DATABASE_URL;
	const connection = drizzle({
		connection: { connectionString },
		relations,
	});

	return connection;
}

export const drizzleConnection = await createDrizzleConnection();

export type DrizzleConnection = typeof drizzleConnection;
