# Sign In With Access TypeScript/JavaScript Integration Library

The NPM package `@projectlibertylabs/siwa` offers both CommonJS and ESM exports.

## Install

- NPM: `npm i @projectlibertylabs/siwa`
- Yarn: `yarn add @projectlibertylabs/siwa`

## Documentation

See [Markdown/GitHub Docs](../../docs/src/QuickStart.md) or
[Live Docs](https://projectlibertylabs.github.io/siwa/QuickStart.html).

### JS API Functions

| Function                       | Description                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `generateAuthenticationUrl`          | Generates the signed request for the authentication flow with Frequency Access                                 |
| `getLoginResult`               | Fetch and extract the Result of the Login from Frequency Access                                                |
| `hasChainSubmissions`          | Checks to see if there are any chain submissions in the given result                                           |
| `generateSignedRequest`        | Generates the signed payload for the authentication flow with Frequency Access using a keypair                 |
| `buildSignedRequest`           | Builds the signed request for the authentication flow with Frequency Access using the signature and public key |
| `generateEncodedSignedRequest` | Generates the encoded signed payload for the authentication flow with Frequency Access using a keypair         |
| `encodeSignedRequest`          | Encodes a signed request for the authentication flow as a base64url string                                     |
| `decodeSignedRequest`          | Decodes a base64url encoded signed request for the authentication flow with Frequency Access                   |
| `generateRequestSigningData`   | Generates the hex of the payload for signing                                                                   |

### JS API Constants

| Constants                        | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| `VerifiedEmailAddressCredential` | Request for a verified email address           |
| `VerifiedPhoneNumberCredential`  | Request for a verified SMS/Phone Number        |
| `VerifiedGraphKeyCredential`     | Request for a the private graph encryption key |

### JS API Types

Types are included with the exports for the package

## Development

Library is published on merge to `main` with a development tag `0.0.0-[SHA:6]`. Releases are made via GitHub Releases
with tags in the style: `vX.Y.Z`.
