# Application Context

#### Schema

An application context credential MUST be a W3C Verifiable Credential document containing information about the application requesting user sign in.

The `type` array for the credential should begin with the string `"ApplicationContextCredential"`.

The `credentialSchema` field should contain an object with the following fields:

- `type`: MUST be `JsonSchema`
- `id`: MUST be the URL of the published application context credential schema. The latest version is [`https://schemas.frequencyaccess.com/ApplicationContextCredential/bciqe2bsnuaqg7zy3gqjmwha2q5h2bybvr6log2jsb5kjn2hos6irrlq.json`](https://schemas.frequencyaccess.com/ApplicationContextCredential/bciqe2bsnuaqg7zy3gqjmwha2q5h2bybvr6log2jsb5kjn2hos6irrlq.json).

The `credentialSubject` field should contain an object with the following fields:

- `id`: Your provider identifier, expressed as a DID.
- `application`: A JSON object containing the following keys:
  - `name`: A map of one or more language tags to human-readable string values. Language tags should follow [BCP-47/RFC-5646](https://www.rfc-editor.org/rfc/rfc5646.html) (as used in the HTTP `Content-Language` header). A content language key of `"*"` indicates a wildcard or default value, as in HTTP.
  - `logo`: A map of one or more language tags (as above) to objects containing a `url` property. The URL should resolve to an image in the PNG format. The recommended image size is 250 x 100 pixels.

The credential SHOULD be signed by a trusted `issuer`.
The issuer MAY be the provider's control key, expressed in `did:key` syntax.

#### Example

This application context credential describes a hypothetical app called "My Social App".

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/undefined-terms/v2"
  ],
  "type": [
    "ApplicationContextCredential",
    "VerifiableCredential"
  ],
  "issuer": "did:key:z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
  "validFrom": "2025-02-12T21:28:08.289+0000",
  "credentialSchema": {
    "type": "JsonSchema",
    "id": "https://schemas.frequencyaccess.com/ApplicationContextCredential/bciqe2bsnuaqg7zy3gqjmwha2q5h2bybvr6log2jsb5kjn2hos6irrlq.json"
  },
  "credentialSubject": {
    "id": "did:key:z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
    "application": {
      "name": {
        "en": "My Social App",
        "es": "Mi Aplicación Social"
      },
      "logo": {
        "*": {
          "url": "https://example.org/logos/my-social-app.png"
        }
      }
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:key:z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD#z6MkofWExWkUvTZeXb9TmLta5mBT6Qtj58es5Fqg1L5BCWQD",
    "cryptosuite": "eddsa-rdfc-2022",
    "proofPurpose": "assertionMethod",
    "proofValue": "z4jArnPwuwYxLnbBirLanpkcyBpmQwmyn5f3PdTYnxhpy48qpgvHHav6warjizjvtLMg6j3FK3BqbR2nuyT2UTSWC"
  }
}
```
