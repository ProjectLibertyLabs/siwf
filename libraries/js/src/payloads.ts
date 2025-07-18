import { signatureVerify, cryptoWaitReady, decodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { stringToU8a, u8aToHex, u8aWrapBytes } from '@polkadot/util';
import {
  isPayloadAddProvider,
  isPayloadClaimHandle,
  isPayloadItemActions,
  isPayloadLogin,
  isPayloadRecoveryCommitment,
  SiwfResponsePayloadLogin,
} from './types/payload.js';
import { SiwfResponse } from './types/response.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
  serializeRecoveryCommitmentPayloadHex,
} from './util.js';
import {
  CurveType,
  isSignedPayloadSupportedPayload,
  isSignedPayloadUint8Array,
  SignedPayload,
  SiwfOptions,
  SiwfPublicKey,
} from './types/general.js';
import { HexString, createSiwfLoginRequestPayload, verifySignature } from '@frequency-chain/ethereum-utils';

interface SiwxMessage {
  domain: string;
  address: string;
  nonce: string;
  expired: boolean;
  issuedAt: Date;
  expirationTime?: Date;
  uri: string;
}

interface ParsedUri {
  scheme: string | null;
  domain?: string;
  path?: string;
  queryString?: string;
}

/**
 * Parses a given message string and extracts various components into a SiwxMessage object.
 *
 * @param message - The message string to be parsed.
 * @returns An object containing the parsed components:
 *  - `domain`: The domain extracted from the first line of the message.
 *  - `address`: The address extracted from the second line of the message.
 *  - `nonce`: The nonce extracted from the message.
 *  - `uri`: The URI extracted from the message.
 *  - `expired`: A boolean indicating whether the message has expired.
 *  - `issuedAt`: The date and time when the message was issued.
 *  - `expirationTime`: The date and time when the message expires, if available.
 */
function parseMessage(message: string): SiwxMessage {
  const msgSplit = message.split('\n');
  const domain = (msgSplit[0] || '').split(' ')[0] || '';

  const addressLines = (msgSplit[1] || '').split(':');
  const address = addressLines[addressLines.length - 1] || '';

  const nonceLine = msgSplit.find((x) => x.startsWith('Nonce: '));
  const nonce = nonceLine ? nonceLine.replace('Nonce: ', '') : '';

  const uriLine = msgSplit.find((x) => x.startsWith('URI: '));
  const uri = uriLine ? uriLine.replace('URI: ', '') : '';

  const expiredLine = msgSplit.find((x) => x.startsWith('Expiration Time: '));
  const expiredString = expiredLine ? expiredLine.replace('Expiration Time: ', '') : '';
  const expirationTime = expiredString ? new Date(expiredString) : undefined;
  const expired = expirationTime ? +expirationTime < Date.now() : false;

  const issuedLine = msgSplit.find((x) => x.startsWith('Issued At: '));
  const issuedString = issuedLine ? issuedLine.replace('Issued At: ', '') : '';
  const issuedAt = new Date(issuedString);

  return {
    domain,
    address,
    nonce,
    uri,
    expired,
    issuedAt,
    expirationTime,
  };
}

// SIWA is switching away from this, but we should still support it for now
function verifySignatureHashMaybeWrapped(publicKey: string, signature: string, message: Uint8Array): boolean {
  const unwrappedSigned = message.length > 256 ? blake2AsU8a(message) : message;

  const unwrappedVerifyResult = signatureVerify(unwrappedSigned, signature, publicKey);
  if (unwrappedVerifyResult.isValid) {
    return true;
  }

  // Support both wrapped and unwrapped signatures
  const wrappedSignedBytes = u8aWrapBytes(message);
  const wrappedSigned = wrappedSignedBytes.length > 256 ? blake2AsU8a(wrappedSignedBytes) : wrappedSignedBytes;
  const wrappedVerifyResult = signatureVerify(wrappedSigned, signature, publicKey);

  return wrappedVerifyResult.isValid;
}

/**
 * Verifies a signature against a given public key and message. This function supports both wrapped and unwrapped signatures.
 *
 * @param curveType - curve type
 * @param publicKey - The public key used to verify the signature.
 * @param signature - The signature to be verified.
 * @param message - The original message that was signed.
 * @param options - Environment options.
 * @returns `true` if the signature is valid, `false` otherwise.
 */
function verifySignatureMaybeWrapped(
  curveType: CurveType,
  publicKey: string,
  signature: string,
  message: SignedPayload,
  options: SiwfOptions
): boolean {
  if (curveType === 'Sr25519' && isSignedPayloadUint8Array(message)) {
    const unwrappedVerifyResult = signatureVerify(message, signature, publicKey);
    if (unwrappedVerifyResult.isValid) {
      return true;
    }

    // Support both wrapped and unwrapped signatures
    const wrappedSignedBytes = u8aWrapBytes(message);
    const wrappedVerifyResult = signatureVerify(wrappedSignedBytes, signature, publicKey);

    return wrappedVerifyResult.isValid || verifySignatureHashMaybeWrapped(publicKey, signature, message);
  } else if (curveType === 'Secp256k1' && isSignedPayloadSupportedPayload(message)) {
    return verifySignature(publicKey as HexString, signature as HexString, message, options.chainType);
  } else {
    throw new Error(`${curveType} is not supported!`);
  }
}

function expect(test: boolean, errorMessage: string) {
  if (!test) throw new Error(errorMessage);
}

/**
 * Validates that the provided message domain matches the expected domain.
 *
 * This function checks the following:
 * 1. If the domains have schemes (e.g., `https://`), the schemes must match.
 * 2. The paths within the domains must match.
 * 3. The domains themselves must match.
 *
 * @param msgUri - The uri from the message to be validated. This can include an optional scheme and path.
 * @param expectedUri - The expected uri to validate against. This can include an optional scheme and path.
 *
 * @throws Will throw an error if the schemes, paths, or domains do not match.
 */
function validateDomainAndUri(msgUri: string, expectedUri: string | string[]) {
  const parseUri = (uri: string): ParsedUri => {
    const [scheme, domainWithPath] = uri.includes('://') ? uri.split('://', 2) : [null, uri];
    const [domainAndPath, queryString] = domainWithPath.split('?', 2) ?? [domainWithPath, ''];
    const [domain, path] = domainAndPath?.split('/', 2) ?? [domainAndPath, ''];
    return { scheme, domain, path, queryString };
  };

  const msgParsed = parseUri(msgUri);

  const errors: string[] = [];
  const uri = Array.isArray(expectedUri) ? expectedUri : [expectedUri];
  for (const expected of uri) {
    const expectedParsed = parseUri(expected);
    const error = validateParsedDomainAndUri(msgParsed, expectedParsed);
    if (!error) return;
    errors.push(error);
  }

  expect(errors.length === 0, 'Message does not match any expected domain. ' + errors.join('\n'));
}

function validateParsedDomainAndUri(msgParsed: ParsedUri, expectedParsed: ParsedUri): string | null {
  try {
    // If the expected URI has a scheme, the scheme must match
    if (expectedParsed.scheme) {
      expect(
        msgParsed.scheme === expectedParsed.scheme,
        `Message does not match expected domain. Domain scheme mismatch. Scheme: ${msgParsed.scheme} Expected: ${expectedParsed.scheme}`
      );
    }

    // If the expected URI has a path, the path must match
    if (expectedParsed.path) {
      expect(
        msgParsed.path === expectedParsed.path,
        `Message does not match expected domain. Domain path mismatch. Path: ${msgParsed.path} Expected: ${expectedParsed.path}`
      );
    }

    // Ignore ports in validation
    const msgParsedDomain = msgParsed.domain?.split(':')[0];
    const expectedParsedDomain = expectedParsed.domain?.split(':')[0];

    // If the domain in the message does not match the domain in the URI, throw an error
    expect(
      msgParsedDomain === expectedParsedDomain,
      `Message does not match expected domain. Domain: ${msgParsedDomain} Expected: ${expectedParsedDomain}`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.message;
  }

  return null;
}

/**
 * Validates the login payload by verifying the signature, message contents, domain, and address.
 *
 * @param payload - The login payload to validate.
 * @param userPublicKey - The public key of the user.
 * @param options - Environmental options (contains expected domain of the login message.)
 *
 * @throws Will throw an error if the signature verification fails.
 * @throws Will throw an error if the domain validation fails.
 * @throws Will throw an error if the address decoding or comparison fails.
 * @throws Will throw an error if the message has expired.
 */
function validateLoginPayload(
  payload: SiwfResponsePayloadLogin,
  userPublicKey: SiwfPublicKey,
  options: SiwfOptions
): void {
  // Check that the userPublicKey signed the message
  if (userPublicKey.type === 'Sr25519') {
    expect(
      verifySignatureMaybeWrapped(
        userPublicKey.type,
        userPublicKey.encodedValue,
        payload.signature.encodedValue,
        stringToU8a(payload.payload.message),
        options
      ),
      'Login message signature failed'
    );
  } else if (userPublicKey.type === 'Secp256k1') {
    expect(
      verifySignature(
        userPublicKey.encodedValue as HexString,
        payload.signature.encodedValue as HexString,
        createSiwfLoginRequestPayload(payload.payload.message),
        options.chainType
      ),
      'Login message signature failed'
    );
  } else {
    throw Error(`Invalid key type ${userPublicKey.type}`);
  }

  // Validate the message contents
  const msg = parseMessage(payload.payload.message);

  // Validate the domain
  validateDomainAndUri(msg.uri, options?.loginMsgUri ?? '');

  // Match address encoding before comparing
  // decodeAddress will throw if it cannot decode meaning bad address
  try {
    if (userPublicKey.type === 'Sr25519') {
      const msgAddr = decodeAddress(msg.address);
      const userAddr = decodeAddress(userPublicKey.encodedValue);
      // Hex for easy comparison
      expect(u8aToHex(msgAddr) === u8aToHex(userAddr), 'Address mismatch');
    } else if (userPublicKey.type === 'Secp256k1') {
      expect(msg.address.toLowerCase() === userPublicKey.encodedValue.toLowerCase(), 'Address mismatch');
    }
  } catch (_e) {
    throw new Error(
      `Invalid address or message does not match bytes of expected user public key value. Message: ${msg.address} User: ${userPublicKey.encodedValue}`
    );
  }

  if (msg.expirationTime) {
    expect(!msg.expired, `Message has expired. Message: ${msg.expirationTime.toISOString()}`);
  }
}

function validateExtrinsicPayloadSignature(
  curveType: CurveType,
  key: string,
  signature: string,
  message: SignedPayload,
  options: SiwfOptions
) {
  expect(verifySignatureMaybeWrapped(curveType, key, signature, message, options), 'Payload signature failed');
}

export async function validatePayloads(response: SiwfResponse, options: SiwfOptions): Promise<void> {
  // Wait for the WASM to load
  await cryptoWaitReady();
  response.payloads.every((payload) => {
    switch (true) {
      case isPayloadLogin(payload):
        return validateLoginPayload(payload, response.userPublicKey, options);
      case isPayloadAddProvider(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.type,
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeAddProviderPayloadHex(response.userPublicKey.type, payload.payload),
          options
        );
      case isPayloadClaimHandle(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.type,
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeClaimHandlePayloadHex(response.userPublicKey.type, payload.payload),
          options
        );
      case isPayloadItemActions(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.type,
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeItemActionsPayloadHex(response.userPublicKey.type, payload.payload),
          options
        );
      case isPayloadRecoveryCommitment(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.type,
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeRecoveryCommitmentPayloadHex(response.userPublicKey.type, payload.payload),
          options
        );
    }
    throw new Error(`Unknown or Bad Payload: ${payload.type}`);
  });
}
