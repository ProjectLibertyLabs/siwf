import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF request test", () => {
  it("should return a valid Authentication URL from the real SIWF server", async () => {
    const providerKeyUri: string = "//Alice";
    const callbackUri: string = "http://localhost:3000/callback"; // Ensure the mock server is running
    const permissions: number[] = [5, 7, 8, 9, 10];
    const credentials = [siwf.VerifiedEmailAddressCredential];

    try {
      const signedRequest = await siwf.generateSignedRequest(providerKeyUri, callbackUri, permissions, credentials);
      const authenticationUrl = await siwf.generateAuthenticationUrl(
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
