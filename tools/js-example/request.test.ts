import { describe, it, expect } from "vitest";
import * as siwa from "@projectlibertylabs/siwa";

describe("SIWA request test", () => {
  it("should return a valid Authentication URL from the real SIWA server", async () => {
    const providerKeyUri: string = "//Alice";
    const callbackUri: string = "http://localhost:3000/callback"; // Ensure the mock server is running
    const permissions: number[] = [5, 7, 8, 9, 10];
    const credentials = [siwa.VerifiedEmailAddressCredential];

    try {
      const signedRequest = await siwa.generateSignedRequest(providerKeyUri, callbackUri, permissions, credentials);
      const authenticationUrl = await siwa.generateAuthenticationUrl(
        signedRequest,
        new URLSearchParams({ mode: "dark" }),
      );
      expect(authenticationUrl).toContain("mode=dark");
      expect(authenticationUrl).toContain("signedRequest=");
    } catch (error) {
      throw new Error("Error in generating Authentication URL: " + error);
    }
  });
});
