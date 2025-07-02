import { writeFileSync } from 'node:fs';
import Keyring from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  ExampleEmailCredential,
  ExamplePhoneCredential,
  ExampleUserGraphCredential,
  ExampleUserRecoverySecretCredential,
} from './credentials.js';
import {
  ExampleLoginSr25519,
  ExampleNewProviderSr25519,
  ExampleNewUserSr25519,
  ExampleLoginSecp256k1,
  ExampleNewProviderSecp256k1,
  ExampleNewUserSecp256k1,
} from './index.js';
import { serializeLoginPayloadHex } from '../util.js';
import { encodeSignedRequest } from '../request.js';
import { SiwfSignedRequest } from '../types/request.js';
import { createSiwfSignedRequestPayload, sign } from '@frequency-chain/ethereum-utils';

function output(obj: unknown, file: string) {
  writeFileSync(file, '```json\n' + JSON.stringify(obj, null, 2) + '\n```\n');
}

function exampleSignedRequestSr25519(): SiwfSignedRequest {
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
        algo: 'SR25519',
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
        type: 'VerifiedRecoverySecretCredential',
        hash: ['bciqpg6qm4rnu2j4v6ghxqqgwkggokwvxs3t2bexbd3obkypkiryylxq'],
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
    applicationContext: {
      url: 'https://example.org/myapp/siwf-manifest.json',
    },
  };
}

async function exampleSignedRequestSecp256k1(): Promise<SiwfSignedRequest> {
  const privateKey = '0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133';
  const payload = {
    callback: 'http://localhost:3000',
    permissions: [5, 7, 8, 9, 10],
  };
  const requestPayload = createSiwfSignedRequestPayload(payload.callback, payload.permissions);
  const signature = await sign(privateKey, requestPayload, 'Dev');

  return {
    requestedSignatures: {
      publicKey: {
        encodedValue: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
        encoding: 'base16',
        format: 'eip-55',
        type: 'Secp256k1',
      },
      signature: {
        algo: 'SECP256K1',
        encoding: 'base16',
        encodedValue: signature.Ecdsa,
      },
      payload,
    },
    requestedCredentials: [
      {
        type: 'VerifiedGraphKeyCredential',
        hash: ['bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y'],
      },
      {
        type: 'VerifiedRecoverySecretCredential',
        hash: ['bciqpg6qm4rnu2j4v6ghxqqgwkggokwvxs3t2bexbd3obkypkiryylxq'],
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
    applicationContext: {
      url: 'https://example.org/myapp/siwf-manifest.json',
    },
  };
}

function exampleRequest(incomingSignedRequest: SiwfSignedRequest) {
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

  // ------- Sr25519 -------//
  const signedRequestSr25519 = exampleSignedRequestSr25519();
  const requestParamsSr25519 = exampleRequest(signedRequestSr25519);
  const requestUrlSr25519 = new URL(
    `https://testnet.frequencyaccess.com/siwa/start?${new URLSearchParams(requestParamsSr25519)}`
  );

  output(signedRequestSr25519, '../../docs/src/DataStructures/Sr25519/SignedRequest.md');
  output(requestParamsSr25519, '../../docs/src/DataStructures/Sr25519/Request.md');
  output(requestUrlSr25519, '../../docs/src/DataStructures/Sr25519/RequestUrl.md');
  output(await ExampleLoginSr25519(), '../../docs/src/DataStructures/Sr25519/Response-LoginOnly.md');
  output(await ExampleNewUserSr25519(), '../../docs/src/DataStructures/Sr25519/Response-NewUser.md');
  output(await ExampleNewProviderSr25519(), '../../docs/src/DataStructures/Sr25519/Response-NewProvider.md');

  output(await ExampleEmailCredential(), '../../docs/src/DataStructures/VerifiedEmail.md');
  output(await ExamplePhoneCredential(), '../../docs/src/DataStructures/VerifiedPhone.md');
  output(await ExampleUserGraphCredential(), '../../docs/src/DataStructures/VerifiedGraphKeyPair.md');
  output(await ExampleUserRecoverySecretCredential(), '../../docs/src/DataStructures/VerifiedRecoverySecret.md');

  // ------- Secp256k1 -------//
  const signedRequestSecp256k1 = await exampleSignedRequestSecp256k1();
  const requestParamsSecp256k1 = exampleRequest(signedRequestSecp256k1);
  const requestUrlSecp256k1 = new URL(
    `https://testnet.frequencyaccess.com/siwa/start?${new URLSearchParams(requestParamsSecp256k1)}`
  );

  output(signedRequestSecp256k1, '../../docs/src/DataStructures/Secp256k1/SignedRequest.md');
  output(requestParamsSecp256k1, '../../docs/src/DataStructures/Secp256k1/Request.md');
  output(requestUrlSecp256k1, '../../docs/src/DataStructures/Secp256k1/RequestUrl.md');
  output(await ExampleLoginSecp256k1(), '../../docs/src/DataStructures/Secp256k1/Response-LoginOnly.md');
  output(await ExampleNewUserSecp256k1(), '../../docs/src/DataStructures/Secp256k1/Response-NewUser.md');
  output(await ExampleNewProviderSecp256k1(), '../../docs/src/DataStructures/Secp256k1/Response-NewProvider.md');
}

main().catch(console.error).finally(process.exit);
