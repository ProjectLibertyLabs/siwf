import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF request test", () => {
  it("should return a valid Authentication URL from the real SIWF server Sr25519", async () => {
    const providerKeyUri: string = "//Alice";
    const callbackUri: string = "http://localhost:3000/callback"; // Ensure the mock server is running
    const permissions: number[] = [5, 7, 8, 9, 10];
    const credentials = [siwf.VerifiedEmailAddressCredential];

    try {
      const signedRequest = await siwf.generateSignedRequest('base58', 'ss58', 'Sr25519', 'Dev', providerKeyUri, callbackUri, permissions, credentials);
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

  it("should return a valid Authentication URL from the real SIWF server Secp256k1", async () => {
    const providerKeyUri: string = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
    const callbackUri: string = "http://localhost:3000/callback"; // Ensure the mock server is running
    const permissions: number[] = [5, 7, 8, 9, 10];
    const credentials = [siwf.VerifiedEmailAddressCredential];

    try {
      const signedRequest = await siwf.generateSignedRequest('base16', 'eip-55', 'Secp256k1', 'Dev', providerKeyUri, callbackUri, permissions, credentials);
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
