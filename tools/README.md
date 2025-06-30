# Examples, Tooling, & Tests

## Mock SIWF Server

This is a very simple mock server to mock the endpoints.
It has both endpoints, but always returns the same thing.

### Authentication Codes for Different Responses

#### Sr25519
- `loginAuthCode123_Sr25519`: Login Response from `//Bob`
- `newProviderAuthCode456_Sr25519`: New Provider Response from `//Bob`
- `newUserAuthCode789_Sr25519`: New User Response from `//Bob`

#### Secp256k1
- `loginAuthCode123_Secp256k1`: Login Response from private key `0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133`
- `newProviderAuthCode456_Secp256k1`: New Provider Response from private key `0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133`
- `newUserAuthCode789_Secp256k1`: New User Response from private key `0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133`

## JS-Example

This is a set of tests that use a locally build version of `@projectlibertylabs/siwf` to test the library as built against the Mock SIWF Server.

1. Locally build `@projectlibertylabs/siwf`
    - `cd libraries/js`
    - `npm i`
    - `npm run build`
    - `cd dist && npm pack`
2. Start the Mock Server
    - `cd tools/mock-siwf`
    - `npm i`
    - `npm run start`
3. Install the local build in the Example
    - `cd tools/js-example`
    - `npm i ../../libraries/js/dist/projectlibertylabs-siwf-0.0.0.tgz`
4. Run the Example Tests
    - `cd tools/js-example`
    - `npm test`
