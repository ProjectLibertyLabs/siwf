import { Keyring } from '@polkadot/keyring';
import { encodeAddress } from '@polkadot/keyring';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  SiwfCredentialRequest,
  SiwfSignedRequest,
  isSiwfCredentialsRequest,
  isSiwfSignedRequest,
} from './types/request.js';
import { getAlgorithmForCurveType, requestPayloadBytes, serializeLoginPayloadHex } from './util.js';
import { VerifiedEmailAddress, VerifiedGraphKey, VerifiedPhoneNumber, VerifiedRecoverySecret } from './constants.js';
import { stringFromBase64URL, stringToBase64URL } from './base64url.js';
import {
  createSiwfSignedRequestPayload,
  HexString,
  sign,
  getKeyringPairFromSecp256k1PrivateKey,
  getUnifiedAddress,
} from '@frequency-chain/ethereum-utils';
import { CurveType, EncodingType, FormatType } from './types';

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
 * Request for a human-readable the Recovery Secret
 */
export const VerifiedRecoverySecretCredential = VerifiedRecoverySecret.credential;

/**
 * Generates the hex of the payload for signing. Only for Sr25519
 *
 * @param {string} callbackUri - The URI that the user should return to after authenticating.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwf/v2/docs/Delegations.html).
 * @param {boolean} isBytesWrapped - Generate it with (default) or without the `<Bytes>` wrapping.
 *
 * @returns {string} The generated Authentication URL that can be used for authentication.
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
 * Generates the signed request for the authentication flow start.
 *
 * @param {EncodingType} encodingType - The encoding type
 * @param {FormatType} formatType - The format type
 * @param {CurveType} keyType - The key type
 * @param {string} providerKeyUriOrPrivateKey - The URI of a key, usually a seed phrase, but may also include test accounts such as `//Alice` or `//Bob`. * @param {string} callbackUri - The URI that the user should return to after authenticating. Or the private key in hex format for Ethereum keys.
 * @param callbackUri
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwf/v2/docs/Delegations.html).
 * @param {SiwfCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwf/v2/docs/Credentials.html).
 *
 * @param applicationContext
 * @returns {Promise<SiwfSignedRequest>} The generated signed request that can be used for authentication.
 */
export async function generateSignedRequest(
  encodingType: EncodingType,
  formatType: FormatType,
  keyType: CurveType,
  providerKeyUriOrPrivateKey: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwfCredentialRequest[] = [],
  applicationContext: { url: string } | null = null
): Promise<SiwfSignedRequest> {
  await cryptoWaitReady();

  let keyPair;
  let signature;
  let publicKey;

  switch (keyType) {
    case 'Sr25519':
      keyPair = keyring.createFromUri(providerKeyUriOrPrivateKey);
      signature = u8aToHex(keyPair.sign(generateRequestSigningData(callbackUri, permissions, true), {}));
      publicKey = getUnifiedAddress(keyPair);
      break;

    case 'Secp256k1':
      signature = (
        await sign(providerKeyUriOrPrivateKey as HexString, createSiwfSignedRequestPayload(callbackUri, permissions))
      ).Ecdsa;
      publicKey = getKeyringPairFromSecp256k1PrivateKey(hexToU8a(providerKeyUriOrPrivateKey)).address;
      break;

    default:
      throw new Error(`${keyType} is not supported!`);
  }

  return buildSignedRequest(
    encodingType,
    formatType,
    keyType,
    signature,
    publicKey,
    callbackUri,
    permissions,
    credentials,
    applicationContext
  );
}

/**
 * Builds the signed request for the authentication flow.
 *
 * @param {EncodingType} encodingType - The encoding type
 * @param {FormatType} formatType - The format type
 * @param {CurveType} keyType - The key type
 * @param {string} signature - The hex string of the signed data.
 * @param {string} signerPublicKey - The hex or SS58 public key of the signer.
 * @param {string} callbackUri - The URI that the user should return to after authenticating.
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwf/v2/docs/Delegations.html).
 * @param {SiwfCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwf/v2/docs/Credentials.html).
 *
 * @param applicationContext
 * @returns {SiwfSignedRequest} The generated signed request that can be used for authentication.
 */
export function buildSignedRequest(
  encodingType: EncodingType,
  formatType: FormatType,
  keyType: CurveType,
  signature: string,
  signerPublicKey: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwfCredentialRequest[] = [],
  applicationContext: { url: string } | null = null
): SiwfSignedRequest {
  if (!isSiwfCredentialsRequest(credentials)) {
    console.error('credentials', credentials);
    throw new Error('Invalid Credentials Request');
  }
  const requestedCredentials = credentials;

  let encodedAddress: string;
  if (keyType === 'Sr25519') {
    // Should always be encoded as mainnet prefix 90
    encodedAddress = encodeAddress(signerPublicKey, 90);
  } else if (keyType === 'Secp256k1') {
    encodedAddress = signerPublicKey;
  } else {
    throw new Error(`${keyType} is not supported!`);
  }

  return {
    requestedSignatures: {
      publicKey: {
        encodedValue: encodedAddress,
        encoding: encodingType,
        format: formatType,
        type: keyType,
      },
      signature: {
        algo: getAlgorithmForCurveType(keyType),
        encoding: 'base16',
        encodedValue: signature,
      },
      payload: {
        callback: callbackUri,
        permissions,
      },
    },
    requestedCredentials,
    applicationContext: applicationContext || undefined,
  };
}

/**
 * Generates the encoded signed payload for the authentication flow.
 *
 * @param {EncodingType} encodingType - The encoding type
 * @param {FormatType} formatType - The format type
 * @param {CurveType} keyType - The key type
 * @param providerKeyUriOrPrivateKey - The URI of a key, usually a seed phrase, but may also include test accounts such as `//Alice` or `//Bob`. * @param {string} callbackUri - The URI that the user should return to after authenticating. Or the private key in hex format for Ethereum keys. * @param {string} callbackUri - The URI that the user should return to after authenticating.
 * @param callbackUri
 * @param {number[]} permissions - The list of Frequency Schemas IDs that you are requesting the user to delegate. For more details, see [Frequency Schemas Delegations](https://projectlibertylabs.github.io/siwf/v2/docs/Delegations.html).
 * @param {SiwfCredentialRequest[]} credentials - (Optional) List of credentials, either via their full structure. For more details, see [Credentials Reference](https://projectlibertylabs.github.io/siwf/v2/docs/Credentials.html).
 *
 * @param applicationContext
 * @returns {Promise<string>} The generated base64url encoded signed payload that can be that can be used for authentication.
 */
export async function generateEncodedSignedRequest(
  encodingType: EncodingType,
  formatType: FormatType,
  keyType: CurveType,
  providerKeyUriOrPrivateKey: string,
  callbackUri: string,
  permissions: number[],
  credentials: SiwfCredentialRequest[] = [],
  applicationContext: { url: string } | null = null
): Promise<string> {
  const signedRequest = await generateSignedRequest(
    encodingType,
    formatType,
    keyType,
    providerKeyUriOrPrivateKey,
    callbackUri,
    permissions,
    credentials,
    applicationContext
  );
  return encodeSignedRequest(signedRequest);
}

/**
 * Encodes a signed request for the authentication flow as a base64url string.
 *
 * @param {SiwfSignedRequest} signedRequest - A signed request.
 *
 * @returns {string} The generated base64url encoded signed payload that can be that can be used for authentication.
 */
export function encodeSignedRequest(signedRequest: SiwfSignedRequest): string {
  const serialized = JSON.stringify(signedRequest);
  return stringToBase64URL(serialized);
}

/**
 * Decodes a base64url encoded signed request for the authentication flow.
 *
 * @param {string} encodedSignedRequest - A signed request.
 *
 * @returns {SiwfSignedRequest} The generated base64url encoded signed payload that can be that can be used for authentication.
 */
export function decodeSignedRequest(encodedSignedRequest: string): SiwfSignedRequest {
  const serialized = stringFromBase64URL(encodedSignedRequest);
  const signedRequest = JSON.parse(serialized);
  if (isSiwfSignedRequest(signedRequest)) return signedRequest;
  throw new Error('Unable to validate the contents of the encoded signed request as a valid signed request');
}
