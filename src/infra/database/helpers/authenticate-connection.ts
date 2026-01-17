import type { MyPrismaClient } from "../types.js";

export async function authenticateDbConnection(
	prisma: MyPrismaClient,
	logInfoCallback: (msg: string) => void,
) {
	await prisma.$connect();
	logInfoCallback("Database connection has been established successfully.");
}
