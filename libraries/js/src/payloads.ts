import { signatureVerify, cryptoWaitReady, decodeAddress, blake2AsU8a } from '@polkadot/util-crypto';
import { hexToU8a, stringToU8a, u8aToHex, u8aWrapBytes } from '@polkadot/util';
import {
  isPayloadAddProvider,
  isPayloadClaimHandle,
  isPayloadItemActions,
  isPayloadLogin,
  SiwfResponsePayloadLogin,
} from './types/payload.js';
import { SiwfResponse } from './types/response.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
} from './util.js';
import { SiwfPublicKey } from './types/general.js';

interface SiwxMessage {
  domain: string;
  address: string;
  nonce: string;
  expired: boolean;
  issuedAt: Date;
  expirationTime?: Date;
  uri: string;
}

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

function verifySignatureMaybeWrapped(publicKey: string, signature: string, message: Uint8Array): boolean {
  const unwrappedVerifyResult = signatureVerify(message, signature, publicKey);
  if (unwrappedVerifyResult.isValid) {
    return true;
  }

  // Support both wrapped and unwrapped signatures
  const wrappedSignedBytes = u8aWrapBytes(message);
  const wrappedVerifyResult = signatureVerify(wrappedSignedBytes, signature, publicKey);

  return wrappedVerifyResult.isValid || verifySignatureHashMaybeWrapped(publicKey, signature, message);
}

function expect(test: boolean, errorMessage: string) {
  if (!test) throw new Error(errorMessage);
}

function validateLoginPayload(
  payload: SiwfResponsePayloadLogin,
  userPublicKey: SiwfPublicKey,
  loginMsgDomain: string
): void {
  // Check that the userPublicKey signed the message
  expect(
    verifySignatureMaybeWrapped(
      userPublicKey.encodedValue,
      payload.signature.encodedValue,
      stringToU8a(payload.payload.message)
    ),
    'Login message signature failed'
  );

  // Validate the message contents
  const msg = parseMessage(payload.payload.message);
  expect(
    msg.domain === loginMsgDomain,
    `Message does not match expected domain. Message: ${msg.domain} Expected: ${loginMsgDomain}`
  );
  // Match address encoding before comparing
  // decodeAddress will throw if it cannot decode meaning bad address
  try {
    const msgAddr = decodeAddress(msg.address);
    const userAddr = decodeAddress(userPublicKey.encodedValue);
    // Hex for easy comparison
    expect(u8aToHex(msgAddr) === u8aToHex(userAddr), 'Address mismatch');
  } catch (_e) {
    throw new Error(
      `Invalid address or message does not match bytes of expected user public key value. Message: ${msg.address} User: ${userPublicKey.encodedValue}`
    );
  }

  if (msg.expirationTime) {
    expect(!msg.expired, `Message has expired. Message: ${msg.expirationTime.toISOString()}`);
  }
}

function validateExtrinsicPayloadSignature(key: string, signature: string, message: string) {
  expect(verifySignatureMaybeWrapped(key, signature, hexToU8a(message)), 'Payload signature failed');
}

export async function validatePayloads(response: SiwfResponse, loginMsgDomain: string): Promise<void> {
  // Wait for the WASM to load
  await cryptoWaitReady();
  response.payloads.every((payload) => {
    switch (true) {
      case isPayloadLogin(payload):
        return validateLoginPayload(payload, response.userPublicKey, loginMsgDomain);
      case isPayloadAddProvider(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeAddProviderPayloadHex(payload.payload)
        );
      case isPayloadClaimHandle(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeClaimHandlePayloadHex(payload.payload)
        );
      case isPayloadItemActions(payload):
        return validateExtrinsicPayloadSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeItemActionsPayloadHex(payload.payload)
        );
    }
    throw new Error(`Unknown or Bad Payload: ${payload.type}`);
  });
}
