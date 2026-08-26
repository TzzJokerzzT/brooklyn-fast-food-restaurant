import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["node_modules/", "tests/", "*.config.*"],
		},
	},
});
