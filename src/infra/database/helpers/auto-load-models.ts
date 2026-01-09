import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ModelCtor } from "sequelize-typescript";

/*
 * Auto-load all models from the models directory
 * Created cause test enviroment from vitest was conflicting with
 * sequelize-typescript automatic model loading
 * This autoload only works with ESM modules
 */
export async function loadAllModels() {
	const modelsPath = path.join(import.meta.dirname, "..", "models");

	const files = fs
		.readdirSync(modelsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	const models: ModelCtor[] = [];

	for (let indexFiles = 0; indexFiles < files.length; indexFiles++) {
		const file = files[indexFiles];
		const modelFilePath = path.join(modelsPath, file);
		const pathToModelUrl = pathToFileURL(modelFilePath).href;
		const model = await import(pathToModelUrl);
		models.push(model.default);
	}

	return models;
}
