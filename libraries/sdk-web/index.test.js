import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("snapshot only demo-buttons element", async ({ page }) => {
  // Generate absolute path to the HTML file
  const htmlPath = path.resolve(__dirname, "./example.html");
  // Convert to file:// URL format
  const fileUrl = `file://${htmlPath}`;

  // Navigate to the local HTML file
  await page.goto(fileUrl);

  // Ensure any JavaScript on the page has time to execute
  await page.waitForLoadState("domcontentloaded");

  // Find the demo-buttons element
  const demoButtons = page.locator("#demo-buttons");

  // Wait for it to be visible
  await demoButtons.waitFor({ state: "visible" });

  // Give any animations or dynamic content time to stabilize (optional)
  await page.waitForTimeout(500);

  // Take screenshot of only the demo-buttons element
  expect(
    await demoButtons.screenshot({
      animations: "disabled",
      scale: "css",
    }),
  ).toMatchSnapshot("demo-buttons.png");
});
