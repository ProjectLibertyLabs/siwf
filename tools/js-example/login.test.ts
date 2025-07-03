import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF login test", () => {
  it("should retrieve a valid login result from the Mock SIWF server Sr25519", async () => {
    const authorizationCode = "loginAuthCode123_Sr25519"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "testnet.frequencyaccess.com", chainType: 'Dev' };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ");
      expect(result.credentials!.length).toBeGreaterThan(0);
      expect(result.credentials![0].type[0]).toBe("VerifiedEmailAddressCredential");
    } catch (error) {
      throw new Error("Error processing login: " + error);
    }
  });

  it("should retrieve a valid login result from the Mock SIWF server Secp256k1", async () => {
    const authorizationCode = "loginAuthCode123_Secp256k1"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "testnet.frequencyaccess.com", chainType: 'Dev' };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac");
      expect(result.credentials!.length).toBeGreaterThan(0);
      expect(result.credentials![0].type[0]).toBe("VerifiedEmailAddressCredential");
    } catch (error) {
      throw new Error("Error processing login: " + error);
    }
  });
});
