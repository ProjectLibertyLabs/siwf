import express, { Request, Response } from "express";
import loginSr25519 from "./login_Sr25519.json";
import newUserSr25519 from "./new-user_Sr25519.json";
import newProviderSr25519 from "./new-provider_Sr25519.json";
import loginSecp256k1 from "./login_Secp256k1.json";
import newUserSecp256k1 from "./new-user_Secp256k1.json";
import newProviderSecp256k1 from "./new-provider_Secp256k1.json";

const app = express();
app.use(express.json());

// Mock authorization codes for different scenarios
const authCodes = {
  loginSr25519: "loginAuthCode123_Sr25519",
  newProviderSr25519: "newProviderAuthCode456_Sr25519",
  newUserSr25519: "newUserAuthCode789_Sr25519",
  loginSecp256k1: "loginAuthCode123_Secp256k1",
  newProviderSecp256k1: "newProviderAuthCode456_Secp256k1",
  newUserSecp256k1: "newUserAuthCode789_Secp256k1",
};

// Mock payloads based on the authorization codes
const payloadsSr25519 = {
  login: loginSr25519,
  newProvider: newProviderSr25519,
  newUser: newUserSr25519,
};
const payloadsSecp256k1 = {
  login: loginSecp256k1,
  newProvider: newProviderSecp256k1,
  newUser: newUserSecp256k1,
};

// GET /api/payload: Return mock payload data
app.get("/api/payload", (req: Request, res: Response) => {
  const { authorizationCode } = req.query;

  if (authorizationCode === authCodes.loginSr25519) {
    console.log("Responding with Login payload");
    res.json(payloadsSr25519.login);
  } else if (authorizationCode === authCodes.newProviderSr25519) {
    console.log("Responding with New Provider payload");
    res.json(payloadsSr25519.newProvider);
  } else if (authorizationCode === authCodes.newUserSr25519) {
    console.log("Responding with New User payload");
    res.json(payloadsSr25519.newUser);
  } else if (authorizationCode === authCodes.loginSecp256k1) {
    console.log("Responding with Login payload");
    res.json(payloadsSecp256k1.login);
  } else if (authorizationCode === authCodes.newProviderSecp256k1) {
    console.log("Responding with New Provider payload");
    res.json(payloadsSecp256k1.newProvider);
  } else if (authorizationCode === authCodes.newUserSecp256k1) {
    console.log("Responding with New User payload");
    res.json(payloadsSecp256k1.newUser);
  } else {
    console.log("Invalid authorization code:", authorizationCode);
    res.status(400).json({ error: "Invalid authorization code" });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Mock Frequency Access server running on http://localhost:3000");
});
