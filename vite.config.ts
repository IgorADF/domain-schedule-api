import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		testTimeout: 50_000,
		hookTimeout: 30_000,
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
