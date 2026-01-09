import {
	runFinalTestDbConfigs,
	runInitTestDbConfigs,
} from "@/infra/database/helpers/run-test-enviroment.js";
import { fastifyInstance } from "../../server-config.js";

export async function runInitTestConfigs() {
	await runInitTestDbConfigs();
	await fastifyInstance.ready();

	return fastifyInstance;
}

export async function runFinalTestConfigs() {
	await runFinalTestDbConfigs();
	await fastifyInstance.ready();
}
