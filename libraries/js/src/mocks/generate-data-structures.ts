import { writeFileSync } from 'node:fs';
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { ExampleEmailCredential, ExamplePhoneCredential, ExampleUserGraphCredential } from './credentials.js';
import { ExampleLogin, ExampleNewProvider, ExampleNewUser } from './index.js';
import { serializeLoginPayloadHex } from '../util.js';
import { encodeSignedRequest } from '../request.js';
import { SiwaSignedRequest } from '../types/request.js';

function output(obj: unknown, file: string) {
  writeFileSync(file, '```json\n' + JSON.stringify(obj, null, 2) + '\n```\n');
}

function exampleSignedRequest(): SiwaSignedRequest {
  const keyring = new Keyring({ type: 'sr25519' });
  const payload = {
    callback: 'http://localhost:3000',
    permissions: [5, 7, 8, 9, 10],
  };
  const requestPayload = serializeLoginPayloadHex(payload);

  const alice = keyring.createFromUri('//Alice');
  const signature = alice.sign(requestPayload);

  return {
    requestedSignatures: {
      publicKey: {
        encodedValue: 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH',
        encoding: 'base58',
        format: 'ss58',
        type: 'Sr25519',
      },
      signature: {
        algo: 'Sr25519',
        encoding: 'base16',
        encodedValue: u8aToHex(signature),
      },
      payload,
    },
    requestedCredentials: [
      {
        type: 'VerifiedGraphKeyCredential',
        hash: ['bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y'],
      },
      {
        anyOf: [
          {
            type: 'VerifiedEmailAddressCredential',
            hash: ['bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi'],
          },
          {
            type: 'VerifiedPhoneNumberCredential',
            hash: ['bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq'],
          },
        ],
      },
    ],
  };
}

function exampleRequest(incomingSignedRequest: SiwaSignedRequest) {
  const signedRequest = encodeSignedRequest(incomingSignedRequest);
  return {
    signedRequest,
    // additionalCallbackUrlParams
    mode: 'dark',
  };
}

async function main() {
  await cryptoWaitReady();
  console.log('Starting work generating Data Structures for the Markdown...');

  const signedRequest = exampleSignedRequest();
  const requestParams = exampleRequest(signedRequest);
  const requestUrl = new URL(`https://testnet.frequencyaccess.com/siwa/start?${new URLSearchParams(requestParams)}`);

  output(signedRequest, '../../docs/src/DataStructures/SignedRequest.md');

  output(requestParams, '../../docs/src/DataStructures/Request.md');
  output(requestUrl, '../../docs/src/DataStructures/RequestUrl.md');

  output(await ExampleLogin(), '../../docs/src/DataStructures/Response-LoginOnly.md');
  output(await ExampleNewUser(), '../../docs/src/DataStructures/Response-NewUser.md');
  output(await ExampleNewProvider(), '../../docs/src/DataStructures/Response-NewProvider.md');

  output(await ExampleEmailCredential(), '../../docs/src/DataStructures/VerifiedEmail.md');
  output(await ExamplePhoneCredential(), '../../docs/src/DataStructures/VerifiedPhone.md');
  output(await ExampleUserGraphCredential(), '../../docs/src/DataStructures/VerifiedGraphKeyPair.md');
}

main().catch(console.error).finally(process.exit);
