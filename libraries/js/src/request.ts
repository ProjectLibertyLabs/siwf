import { Keyring } from '@polkadot/keyring';
import { encodeAddress } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  SiwaCredentialRequest,
  SiwaSignedRequest,
  isSiwaCredentialsRequest,
  isSiwaSignedRequest,
} from './types/request.js';
import { requestPayloadBytes, serializeLoginPayloadHex } from './util.js';
import { VerifiedEmailAddress, VerifiedGraphKey, VerifiedPhoneNumber } from './constants.js';
import { stringFromBase64URL, stringToBase64URL } from './base64url.js';

const keyring = new Keyring({ type: 'sr25519' });

/**
 * Request for a verified email address
 */
export const VerifiedEmailAddressCredential = VerifiedEmailAddress.credential;

/**
 * Request for a verified SMS/Phone Number
 */
export const VerifiedPhoneNumberCredential = VerifiedPhoneNumber.credential;

/**
 * Request for a the private graph encryption key
 */
export const VerifiedGraphKeyCredential = VerifiedGraphKey.credential;

/**
 * Generates the hex of the payload for signing.
 *
 * @param {string} callbackUri - The URI that the user should return to after authenticating with Frequency Access.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwa/Delegations.html).
 * @param {boolean} isBytesWrapped - Generate it with (default) or without the `<Bytes>` wrapping
 *
 * @returns {string} The generated Authentication URL that can be used for authentication with Frequency Access.
 */
export function generateRequestSigningData(
  callbackUri: string,
  permissions: number[],
  isBytesWrapped: boolean = true
): string {
  const payload = {
    callback: callbackUri,
    permissions,
  };

  if (isBytesWrapped) return serializeLoginPayloadHex(payload);
  return u8aToHex(requestPayloadBytes(payload));
}

/**
 * Generates the signed request for the authentication flow with Frequency Access.
 *
 * @param {string} providerKeyUri - The URI of a key, usually a seed phrase, but may also include test accounts such as `//Alice` or `//Bob`.
 * @param {string} callbackUri - The URI that the user should return to after authenticating with Frequency Access.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwa/Delegations.html).
 * @param {SiwaCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwa/Credentials.html).
 *
 * @returns {Promise<string>} The generated Authentication URL that can be used for authentication with Frequency Access.
 */
export async function generateSignedRequest(
  providerKeyUri: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwaCredentialRequest[] = []
): Promise<SiwaSignedRequest> {
  await cryptoWaitReady();
  const keyPair = keyring.createFromUri(providerKeyUri);

  const signature = keyPair.sign(generateRequestSigningData(callbackUri, permissions, true), {});

  return buildSignedRequest(u8aToHex(signature), keyPair.address, callbackUri, permissions, credentials);
}

/**
 * Builds the signed request for the authentication flow with Frequency Access.
 *
 * @param {string} signature - The hex string of the signed data.
 * @param {string} signerPublicKey - The hex or SS58 public key of the signer.
 * @param {string} callbackUri - The URI that the user should return to after authenticating with Frequency Access.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwa/Delegations.html).
 * @param {SiwaCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwa/Credentials.html).
 *
 * @returns {string} The generated Authentication URL that can be used for authentication with Frequency Access.
 */
export function buildSignedRequest(
  signature: string,
  signerPublicKey: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwaCredentialRequest[] = []
): SiwaSignedRequest {
  if (!isSiwaCredentialsRequest(credentials)) {
    console.error('credentials', credentials);
    throw new Error('Invalid Credentials Request');
  }
  const requestedCredentials = credentials;

  return {
    requestedSignatures: {
      publicKey: {
        // TODO: Should this always be encoded as mainnet 90 or check if mainnet?
        encodedValue: encodeAddress(signerPublicKey, 90),
        encoding: 'base58',
        format: 'ss58',
        type: 'Sr25519',
      },
      signature: {
        algo: 'Sr25519',
        encoding: 'base16',
        encodedValue: signature,
      },
      payload: {
        callback: callbackUri,
        permissions,
      },
    },
    requestedCredentials,
  };
}

/**
 * Generates the encoded signed payload for the authentication flow with Frequency Access.
 *
 * @param {string} providerKeyUri - The URI of a key, usually a seed phrase, but may also include test accounts such as `//Alice` or `//Bob`.
 * @param {string} callbackUri - The URI that the user should return to after authenticating with Frequency Access.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwa/Delegations.html).
 * @param {SiwaCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwa/Credentials.html).
 *
 * @returns {Promise<string>} The generated base64url encoded signed payload that can be that can be used for authentication with Frequency Access.
 */
export async function generateEncodedSignedRequest(
  providerKeyUri: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwaCredentialRequest[] = []
): Promise<string> {
  const signedRequest = await generateSignedRequest(providerKeyUri, callbackUri, permissions, credentials);
  return encodeSignedRequest(signedRequest);
}

/**
 * Encodes a signed request for the authentication flow as a base64url string.
 *
 * @param {SiwaSignedRequest} signedRequest - A signed request.
 *
 * @returns {string} The generated base64url encoded signed payload that can be that can be used for authentication with Frequency Access.
 */
export function encodeSignedRequest(signedRequest: SiwaSignedRequest): string {
  const serialized = JSON.stringify(signedRequest);
  return stringToBase64URL(serialized);
}

/**
 * Decodes a base64url encoded signed request for the authentication flow with Frequency Access.
 *
 * @param {string} encodedSignedRequest - A signed request.
 *
 * @returns {SiwaSignedRequest} The generated base64url encoded signed payload that can be that can be used for authentication with Frequency Access.
 */
export function decodeSignedRequest(encodedSignedRequest: string): SiwaSignedRequest {
  const serialized = stringFromBase64URL(encodedSignedRequest);
  const signedRequest = JSON.parse(serialized);
  if (isSiwaSignedRequest(signedRequest)) return signedRequest;
  throw new Error('Unable to validate the contents of the encoded signed request as a valid signed request');
}
