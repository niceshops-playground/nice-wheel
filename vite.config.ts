/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// When deployed to GitHub Pages at https://<user>.github.io/<repo>/ the app is
// served from a sub-path. The CI workflow sets BASE_PATH=/<repo>/ at build time.
// Locally (dev/test) it falls back to "/".
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
