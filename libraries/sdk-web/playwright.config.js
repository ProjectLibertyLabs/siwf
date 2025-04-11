import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30000,
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}-{platform}{ext}",
  expect: {
    toMatchSnapshot: { threshold: 0.01 }, // Allows for a tiny difference tolerance
  },
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
});
