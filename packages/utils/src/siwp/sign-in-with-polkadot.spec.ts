import '../index';
import { SIWxPayload } from './sign-in-with-x.types';
import { SignInWithPolkadot } from './sign-in-with-polkadot';
import { PolkadotAddress } from './chain-agnostic-address';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@polkadot/extension-dapp', () => ({}));

interface TestData {
  payload: SIWxPayload;
  message: string;
  bytes: Uint8Array;
}

const testData: TestData[] = [
  {
    payload: {
      domain: 'somedomain.com',
      iss: new PolkadotAddress('genesis-hash', 'wallet-address'),
      uri: new URL('https://site.somedomain.com/login'),
      version: '1.0',
      statement: 'I accept the somedomain Terms of Service (http://somedomain.com/tos',
      nonce: 'random bytes',
      issuedAt: new Date(0),
      expirationTime: new Date(300 * 1000), // 5-minute expiration
      notBefore: new Date(1000),
      requestId: 'app-specific value',
      resources: ['http://some-resource', 'https://some-other-resource'],
    },
    message: `somedomain.com wants you to sign in with your Polkadot account:
wallet-address

I accept the somedomain Terms of Service (http://somedomain.com/tos

URI: https://site.somedomain.com/login
Version: 1.0
Nonce: random bytes
Issued At: 1969-12-31T19:00:00.000-05:00
Expiration Time: 1969-12-31T19:05:00.000-05:00
Not Before: 1969-12-31T19:00:01.000-05:00
Request ID: app-specific value
Chain ID: genesis-hash
Resources:
- http://some-resource
- https://some-other-resource
`,
    bytes: new Uint8Array([
      115, 111, 109, 101, 100, 111, 109, 97, 105, 110, 46, 99, 111, 109, 32, 119, 97, 110, 116, 115, 32, 121, 111, 117,
      32, 116, 111, 32, 115, 105, 103, 110, 32, 105, 110, 32, 119, 105, 116, 104, 32, 121, 111, 117, 114, 32, 80, 111,
      108, 107, 97, 100, 111, 116, 32, 97, 99, 99, 111, 117, 110, 116, 58, 10, 119, 97, 108, 108, 101, 116, 45, 97, 100,
      100, 114, 101, 115, 115, 10, 10, 73, 32, 97, 99, 99, 101, 112, 116, 32, 116, 104, 101, 32, 115, 111, 109, 101,
      100, 111, 109, 97, 105, 110, 32, 84, 101, 114, 109, 115, 32, 111, 102, 32, 83, 101, 114, 118, 105, 99, 101, 32,
      40, 104, 116, 116, 112, 58, 47, 47, 115, 111, 109, 101, 100, 111, 109, 97, 105, 110, 46, 99, 111, 109, 47, 116,
      111, 115, 10, 10, 85, 82, 73, 58, 32, 104, 116, 116, 112, 115, 58, 47, 47, 115, 105, 116, 101, 46, 115, 111, 109,
      101, 100, 111, 109, 97, 105, 110, 46, 99, 111, 109, 47, 108, 111, 103, 105, 110, 10, 86, 101, 114, 115, 105, 111,
      110, 58, 32, 49, 46, 48, 10, 78, 111, 110, 99, 101, 58, 32, 114, 97, 110, 100, 111, 109, 32, 98, 121, 116, 101,
      115, 10, 73, 115, 115, 117, 101, 100, 32, 65, 116, 58, 32, 49, 57, 54, 57, 45, 49, 50, 45, 51, 49, 84, 49, 57, 58,
      48, 48, 58, 48, 48, 46, 48, 48, 48, 45, 48, 53, 58, 48, 48, 10, 69, 120, 112, 105, 114, 97, 116, 105, 111, 110,
      32, 84, 105, 109, 101, 58, 32, 49, 57, 54, 57, 45, 49, 50, 45, 51, 49, 84, 49, 57, 58, 48, 53, 58, 48, 48, 46, 48,
      48, 48, 45, 48, 53, 58, 48, 48, 10, 78, 111, 116, 32, 66, 101, 102, 111, 114, 101, 58, 32, 49, 57, 54, 57, 45, 49,
      50, 45, 51, 49, 84, 49, 57, 58, 48, 48, 58, 48, 49, 46, 48, 48, 48, 45, 48, 53, 58, 48, 48, 10, 82, 101, 113, 117,
      101, 115, 116, 32, 73, 68, 58, 32, 97, 112, 112, 45, 115, 112, 101, 99, 105, 102, 105, 99, 32, 118, 97, 108, 117,
      101, 10, 67, 104, 97, 105, 110, 32, 73, 68, 58, 32, 103, 101, 110, 101, 115, 105, 115, 45, 104, 97, 115, 104, 10,
      82, 101, 115, 111, 117, 114, 99, 101, 115, 58, 10, 45, 32, 104, 116, 116, 112, 58, 47, 47, 115, 111, 109, 101, 45,
      114, 101, 115, 111, 117, 114, 99, 101, 10, 45, 32, 104, 116, 116, 112, 115, 58, 47, 47, 115, 111, 109, 101, 45,
      111, 116, 104, 101, 114, 45, 114, 101, 115, 111, 117, 114, 99, 101, 10,
    ]),
  },
  {
    payload: {
      domain: 'somedomain.com',
      iss: new PolkadotAddress('genesis-hash', 'wallet-address'),
      uri: new URL('https://site.somedomain.com/login'),
      version: '1.0',
    },
    message: `somedomain.com wants you to sign in with your Polkadot account:
wallet-address

URI: https://site.somedomain.com/login
Version: 1.0
Chain ID: genesis-hash
`,
    bytes: new Uint8Array([
      115, 111, 109, 101, 100, 111, 109, 97, 105, 110, 46, 99, 111, 109, 32, 119, 97, 110, 116, 115, 32, 121, 111, 117,
      32, 116, 111, 32, 115, 105, 103, 110, 32, 105, 110, 32, 119, 105, 116, 104, 32, 121, 111, 117, 114, 32, 80, 111,
      108, 107, 97, 100, 111, 116, 32, 97, 99, 99, 111, 117, 110, 116, 58, 10, 119, 97, 108, 108, 101, 116, 45, 97, 100,
      100, 114, 101, 115, 115, 10, 10, 85, 82, 73, 58, 32, 104, 116, 116, 112, 115, 58, 47, 47, 115, 105, 116, 101, 46,
      115, 111, 109, 101, 100, 111, 109, 97, 105, 110, 46, 99, 111, 109, 47, 108, 111, 103, 105, 110, 10, 86, 101, 114,
      115, 105, 111, 110, 58, 32, 49, 46, 48, 10, 67, 104, 97, 105, 110, 32, 73, 68, 58, 32, 103, 101, 110, 101, 115,
      105, 115, 45, 104, 97, 115, 104, 10,
    ]),
  },
];

describe('sign-in-with-polkadot', () => {
  describe('class SIWPPayload', () => {
    let payload: SignInWithPolkadot;

    test.each(testData)('constructor', ({ payload: testPayload }) => {
      payload = new SignInWithPolkadot(testPayload);

      expect(payload.payload).toStrictEqual(testPayload);
    });

    test.each(testData)('message format should be correct', ({ payload: data, message }) => {
      const payload = new SignInWithPolkadot(data);
      expect(payload.toMessage()).toStrictEqual(message);
    });

    test.each(testData)('message raw bytes should be correct', ({ payload: data, bytes }) => {
      const payload = new SignInWithPolkadot(data);
      expect(payload.toBytes()).toStrictEqual(bytes);
    });
  });
});
