import { signatureVerify, cryptoWaitReady, decodeAddress } from '@polkadot/util-crypto';
import { stringToU8a, u8aToHex, u8aWrapBytes } from '@polkadot/util';
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
  expirationTime: Date;
  uri: string;
}

function parseMessage(message: string): SiwxMessage {
  const msgSplit = message.split('\n');
  const domain = (msgSplit[0] || '').split(' ')[0] || '';
  const address = msgSplit[1] || '';
  const nonceLine = msgSplit.find((x) => x.startsWith('Nonce: '));
  const nonce = nonceLine ? nonceLine.replace('Nonce: ', '') : '';

  const uriLine = msgSplit.find((x) => x.startsWith('URI: '));
  const uri = uriLine ? uriLine.replace('URI: ', '') : '';

  const expiredLine = msgSplit.find((x) => x.startsWith('Expiration Time: '));
  const expiredString = expiredLine ? expiredLine.replace('Expiration Time: ', '') : '';
  const expirationTime = new Date(expiredString);
  const expired = +expirationTime < Date.now();

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

function expect(test: boolean, errorMessage: string) {
  if (!test) throw new Error(errorMessage);
}

function validateLoginPayload(
  payload: SiwfResponsePayloadLogin,
  userPublicKey: SiwfPublicKey,
  loginMsgDomain: string
): void {
  // Check that the userPublicKey signed the message

  const unwrappedSignedMessage = stringToU8a(payload.payload.message);
  const unwrappedVerifyResult = signatureVerify(
    unwrappedSignedMessage,
    payload.signature.encodedValue,
    userPublicKey.encodedValue
  );
  // Support both wrapped and unwrapped signatures
  if (!unwrappedVerifyResult.isValid) {
    const wrappedSignedMessage = u8aWrapBytes(unwrappedSignedMessage);
    const wrappedVerifyResult = signatureVerify(
      wrappedSignedMessage,
      payload.signature.encodedValue,
      userPublicKey.encodedValue
    );

    expect(wrappedVerifyResult.isValid, 'Login message signature failed');
  }

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

  expect(
    !msg.expired,
    `Message does not match expected user public key value. Message: ${msg.expirationTime.toISOString()}`
  );
}

function validateSignature(key: string, signature: string, message: string) {
  const verifyResult = signatureVerify(message, signature, key);
  expect(verifyResult.isValid, 'Payload signature failed');
}

export async function validatePayloads(response: SiwfResponse, loginMsgDomain: string): Promise<void> {
  // Wait for the WASM to load
  await cryptoWaitReady();
  response.payloads.every((payload) => {
    switch (true) {
      case isPayloadLogin(payload):
        return validateLoginPayload(payload, response.userPublicKey, loginMsgDomain);
      case isPayloadAddProvider(payload):
        return validateSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeAddProviderPayloadHex(payload.payload)
        );
      case isPayloadClaimHandle(payload):
        return validateSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeClaimHandlePayloadHex(payload.payload)
        );
      case isPayloadItemActions(payload):
        return validateSignature(
          response.userPublicKey.encodedValue,
          payload.signature.encodedValue,
          serializeItemActionsPayloadHex(payload.payload)
        );
    }
    throw new Error(`Unknown or Bad Payload: ${payload.type}`);
  });
}
