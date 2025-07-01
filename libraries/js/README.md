# Sign In With Frequency (SIWF) V2 JavaScript Library

The NPM package `@projectlibertylabs/siwf@v2` offers both CommonJS and ESM exports.

## Install

- NPM: `npm i @projectlibertylabs/siwf@v2`
- Yarn: `yarn add @projectlibertylabs/siwf@v2`

## Documentation

See [Markdown/GitHub Docs](../../docs/src/QuickStart.md) or
[Live Docs](https://projectlibertylabs.github.io/siwf/v2/docs/QuickStart.html).

### JS API Functions

| Function                       | Description                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `generateAuthenticationUrl`    | Generates the signed request for the authentication flow                                 |
| `getLoginResult`               | Fetch and extract the Result of the Login                                                |
| `hasChainSubmissions`          | Checks to see if there are any chain submissions in the given result                     |
| `validateSiwfResponse`         | Takes a response payload and validates it                                                |
| `generateSignedRequest`        | Generates the signed payload for the authentication flow using a keypair                 |
| `buildSignedRequest`           | Builds the signed request for the authentication flow using the signature and public key |
| `generateEncodedSignedRequest` | Generates the encoded signed payload for the authentication flow using a keypair         |
| `encodeSignedRequest`          | Encodes a signed request for the authentication flow as a base64url string               |
| `decodeSignedRequest`          | Decodes a base64url encoded signed request for the authentication flow                   |
| `generateRequestSigningData`   | Generates the hex of the payload for signing                                             |

### JS API Constants

| Constants                          | Description                                    |
|------------------------------------|------------------------------------------------|
| `VerifiedEmailAddressCredential`   | Request for a verified email address           |
| `VerifiedPhoneNumberCredential`    | Request for a verified SMS/Phone Number        |
| `VerifiedGraphKeyCredential`       | Request for a the private graph encryption key |
| `VerifiedRecoverySecretCredential` | Request for an account recovery secret         |

### SIWF Options

| Parameter     | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| `endpoint`    | The SIWF service URL endpoint                                                      |
| `chainType`   | Used to make sure the signatures are generated and validated for the correct chain |
| `loginMsgUri` | The URI(s) used to validate the CAIP-122 Login Messages                            |



### JS API Types

Types are included with the exports for the package

## Development

Library is published on merge to `main` with a development tag `0.0.0-[SHA:6]`. Releases are made via GitHub Releases
with tags in the style: `vX.Y.Z`.
