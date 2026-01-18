import { TestDatabaseHelper } from "@/infra/database/prisma/helpers/test-enviroment.js";
import type { FastifyZodInstance } from "../../@types/fastity-instance.js";
import { createFastifyInstance } from "../../server-config.js";

let fastifyInstance: FastifyZodInstance | null = null;
let testDatabaseHelper: TestDatabaseHelper | null = null;

export async function runInitTestConfigs() {
	testDatabaseHelper = new TestDatabaseHelper();
	await testDatabaseHelper.run();

	fastifyInstance = await createFastifyInstance(
		testDatabaseHelper.prismaClient,
	);

	await fastifyInstance.ready();

	return fastifyInstance;
}

export async function runFinalTestConfigs() {
	if (!testDatabaseHelper) {
		throw new Error(
			"TestDatabaseHelper was possible overridden and is undefined at runFinalTestConfigs function",
		);
	}

	if (!fastifyInstance) {
		throw new Error(
			"Fastify instance was possible overridden and is undefined at runFinalTestConfigs function",
		);
	}

	await testDatabaseHelper.close();
	await fastifyInstance.close();

	testDatabaseHelper = null;
	fastifyInstance = null;
}
