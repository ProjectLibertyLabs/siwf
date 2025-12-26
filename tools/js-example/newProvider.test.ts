import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF new provider test", () => {
  it("should retrieve a valid new provider result from the real SIWF server Sr25519", async () => {
    const authorizationCode = "newProviderAuthCode456_Sr25519"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "localhost", chainType: 'Dev' };

    let result: any;
    try {
      result = await siwf.getLoginResult(authorizationCode, options);
    } catch (error) {
      throw new Error("Error processing new provider: " + error);
    }
    expect(result.userPublicKey.encodedValue).toBe("f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ");
    expect(result.payloads[0].type).toBe("addProvider");
  });

  it("should retrieve a valid new provider result from the real SIWF server Secp256k1", async () => {
    const authorizationCode = "newProviderAuthCode456_Secp256k1"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "localhost", chainType: 'Dev' };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac");
      expect(result.payloads[0].type).toBe("addProvider");
    } catch (error) {
      throw new Error("Error processing new provider: " + error);
    }
  });
});
