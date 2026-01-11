import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const isTestEnv = process.env.NODE_ENV === "test";

export default defineConfig({
	test: {
		testTimeout: isTestEnv ? 50_000 : 5000,
		hookTimeout: isTestEnv ? 30_000 : 10000,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@domain": resolve(__dirname, "./src/domain"),
			"@infra": resolve(__dirname, "./src/infra"),
			"@api": resolve(__dirname, "./src/apps/api"),
			"@queue": resolve(__dirname, "./src/apps/queue"),
		},
	},
});
