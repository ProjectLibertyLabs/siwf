import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF new user test", () => {
  it("should retrieve a valid new user result from the real SIWF server Sr25519", async () => {
    const authorizationCode = "newUserAuthCode789_Sr25519"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "localhost", chainType: 'Dev' };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ");
      expect(result.payloads[0].endpoint?.extrinsic).toBe("createSponsoredAccountWithDelegation");
    } catch (error) {
      throw new Error("Error processing new user: " + error);
    }
  });

  it("should retrieve a valid new user result from the real SIWF server Secp256k1", async () => {
    const authorizationCode = "newUserAuthCode789_Secp256k1"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "localhost", chainType: 'Dev' };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac");
      expect(result.payloads[0].endpoint?.extrinsic).toBe("createSponsoredAccountWithDelegation");
    } catch (error) {
      throw new Error("Error processing new user: " + error);
    }
  });
});
