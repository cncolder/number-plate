/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { name } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
	base: env.command === "build" ? name : undefined,
	plugins: [react()],

	test: {
		passWithNoTests: true,
	},
}));
