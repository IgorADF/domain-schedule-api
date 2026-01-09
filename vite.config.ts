import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	test: {
		testTimeout: 50_000,
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
