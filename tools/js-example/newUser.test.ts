import { describe, it, expect } from "vitest";
import * as siwf from "@projectlibertylabs/siwf";

describe("SIWF new user test", () => {
  it("should retrieve a valid new user result from the real SIWF server", async () => {
    const authorizationCode = "newUserAuthCode789"; // Ensure this matches the mock server response
    const options = { endpoint: "http://localhost:3000", loginMsgUri: "localhost" };

    try {
      const result = await siwf.getLoginResult(authorizationCode, options);

      expect(result.userPublicKey.encodedValue).toBe("f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ");
      expect(result.payloads[0].endpoint?.extrinsic).toBe("createSponsoredAccountWithDelegation");
    } catch (error) {
      throw new Error("Error processing new user: " + error);
    }
  });
});
