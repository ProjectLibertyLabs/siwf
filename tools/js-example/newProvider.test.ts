import { describe, it, expect } from "vitest";
import * as siwa from "@projectlibertylabs/siwa";

describe("SIWA new provider test", () => {
  it("should retrieve a valid new provider result from the real SIWA server", async () => {
    const authorizationCode = "newProviderAuthCode456"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000" };

    try {
      const result = await siwa.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe(
        "f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ",
      );
      expect(result.payloads[0].type).toBe("addProvider");
    } catch (error) {
      throw new Error("Error processing new provider: " + error);
    }
  });
});
