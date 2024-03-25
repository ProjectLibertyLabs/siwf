import '@frequency-chain/api-augment';
import { SignInResponse, SiwsPayload } from './types';
import { type SiwsMessage, parseMessage as swisParseMessage } from '@talismn/siws';
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { SigninError } from './enums';
import { getMsaforPublicKey } from './helpers';
import { ApiPromise } from '@polkadot/api';

// Re-export the SiwsMessage type
export { type SiwsMessage } from '@talismn/siws';

export type ValidSignIn = {
  msaId: string;
  publicKey: string;
};

/**
 * Validates the signin and throws an error if the validation fails.
 */
export async function validateSignin(
  api: ApiPromise,
  signInResponse: SignInResponse,
  signInDomain: string
): Promise<ValidSignIn> {
  if (signInResponse.siwsPayload) {
    // Parse the message
    let msg: SiwsMessage;
    try {
      msg = parseMessage(signInResponse.siwsPayload.message);
    } catch (e) {
      throw new Error(`${SigninError.InvalidMessage}: ${e.toString() || 'Unknown Error'}`);
    }
    // Validate signature
    if (!isValidSignature(signInResponse.siwsPayload, msg.address)) {
      throw new Error(`${SigninError.InvalidSignature}: Verification failed`);
    }
    // Validate expiration
    if (!isValidExpiration(msg)) {
      throw new Error(`${SigninError.ExpiredSignature}: Expired at ${new Date(msg.expirationTime || 0).toISOString()}`);
    }

    // Validate domain
    if (msg.domain.toLowerCase() !== signInDomain.toLowerCase()) {
      throw new Error(
        `${SigninError.InvalidMessage}: Received domain (${msg.domain}) did not match expected: ${signInDomain}.`
      );
    }

    // Validate MSA control
    const msaId = await isValidControlKey(api, msg);
    if (!msaId) {
      throw new Error(
        `${SigninError.InvalidMsaId}: Signature was for ${msaId || 'NONE'}, but message had: ${msg.resources?.[0] || 'NONE'}`
      );
    }
    // All good!
    return {
      msaId,
      publicKey: msg.address,
    };
  }
  throw new Error(`${SigninError.ResponseError}: ${signInResponse.error || 'Unknown Error'}`);
}

export function parseMessage(message: string): SiwsMessage {
  return swisParseMessage(message);
}

export function isValidExpiration(siwfMessage: SiwsMessage): boolean {
  return !!siwfMessage.expirationTime && siwfMessage.expirationTime > Date.now();
}

export function isValidSignature(payload: SiwsPayload, address: string): boolean {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(payload.message, payload.signature, hexPublicKey).isValid;
}

/**
 * Returns the MSA Id if valid
 */
export async function isValidControlKey(api: ApiPromise, siwsMessage: SiwsMessage): Promise<string | null> {
  const msaUri = new URL(siwsMessage.resources?.[0] || '');
  const msgMsaId = msaUri.pathname.slice(2);
  await api.isReady;
  const verifiedMsa = await getMsaforPublicKey(api, siwsMessage.address);
  if (msgMsaId === verifiedMsa) {
    return msgMsaId;
  }
  return null;
}
