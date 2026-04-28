import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "./src/app"),
      compositions: path.resolve(__dirname, "./src/ds/ui/compositions"),
      data: path.resolve(__dirname, "./src/ds/data"),
      hooks: path.resolve(__dirname, "./src/ds/ui/hooks"),
      icons: path.resolve(__dirname, "./src/ds/ui/icons"),
      images: path.resolve(__dirname, "./src/ds/ui/images"),
      layout: path.resolve(__dirname, "./src/ds/ui/layout"),
      primitives: path.resolve(__dirname, "./src/ds/ui/primitives"),
      utils: path.resolve(__dirname, "./src/ds/ui/utils"),
    },
  },
  server: {
    port: 8000,
  },
  test: {
    css: false,
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
