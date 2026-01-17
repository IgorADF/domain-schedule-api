import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";
import { getSchemaSearchParamFromUrl } from "./schema-database-url.js";

const defaultSchemaName = "public";

export function createDbClient(connectionString: string) {
	const { schemaName } = getSchemaSearchParamFromUrl(connectionString);

	const adapter = new PrismaPg(
		{ connectionString },
		{ schema: schemaName || defaultSchemaName },
	);
	const prisma = new PrismaClient({ adapter });

	return { prisma };
}
