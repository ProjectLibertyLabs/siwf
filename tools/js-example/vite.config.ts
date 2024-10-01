import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.ts"],
    mockReset: true,
  },
});
