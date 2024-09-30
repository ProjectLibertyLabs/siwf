import { describe, it, expect } from "vitest";
import * as siwa from "@projectlibertylabs/siwa";

describe("SIWA login test", () => {
  it("should retrieve a valid login result from the real SIWA server", async () => {
    const authorizationCode = "loginAuthCode123"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000" };

    try {
      const result = await siwa.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe(
        "f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ",
      );
      expect(result.credentials!.length).toBeGreaterThan(0);
      expect(result.credentials![0].type[0]).toBe(
        "VerifiedEmailAddressCredential",
      );
    } catch (error) {
      throw new Error("Error processing login: " + error);
    }
  });
});
