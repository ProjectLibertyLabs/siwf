import { signatureVerify, cryptoWaitReady } from '@polkadot/util-crypto';
import {
  isPayloadAddProvider,
  isPayloadClaimHandle,
  isPayloadItemActions,
  isPayloadLogin,
  SiwaResponsePayloadLogin,
} from './types/payload.js';
import { SiwaResponse } from './types/response.js';
import {
  serializeAddProviderPayloadHex,
  serializeClaimHandlePayloadHex,
  serializeItemActionsPayloadHex,
} from './util.js';
import { SiwaPublicKey } from './types/general.js';

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

function validateLoginPayload(payload: SiwaResponsePayloadLogin, userPublicKey: SiwaPublicKey): void {
  // Check that the userPublicKey signed the message
  const signedMessage = payload.payload.message;
  const verifyResult = signatureVerify(signedMessage, payload.signature.encodedValue, userPublicKey.encodedValue);

  expect(verifyResult.isValid, 'Login message signature failed');

  // Validate the message contents
  const msg = parseMessage(signedMessage);
  // TODO: Get the domain of the callback URL and get it passed through
  //expect(msg.domain === domain, `Message does not match expected domain. Message: ${msg.domain} Expected: ${domain}`);
  expect(
    msg.address === userPublicKey.encodedValue,
    `Message does not match expected user public key value. Message: ${msg.address}`
  );

  expect(
    !msg.expired,
    `Message does not match expected user public key value. Message: ${msg.expirationTime.toISOString()}`
  );
}

function validateSignature(key: string, signature: string, message: string) {
  const verifyResult = signatureVerify(message, signature, key);
  expect(verifyResult.isValid, 'Payload signature failed');
}

export async function validatePayloads(response: SiwaResponse): Promise<void> {
  // Wait for the WASM to load
  await cryptoWaitReady();
  response.payloads.every((payload) => {
    switch (true) {
      case isPayloadLogin(payload):
        return validateLoginPayload(payload, response.userPublicKey);
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
