# Examples, Tooling, & Tests

## Mock SIWF Server

This is a very simple mock server to mock the endpoints.
It has both endpoints, but always returns the same thing.

### Authentication Codes for Different Responses

- `loginAuthCode123`: Login Response from `//Bob`
- `newProviderAuthCode456`: New Provider Response from `//Bob`
- `newUserAuthCode789`: New User Response from `//Bob`


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
