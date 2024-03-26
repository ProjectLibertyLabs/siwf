import '@frequency-chain/api-augment';
import { isHexString, SignInResponse, SiwsPayload } from './types';
import { type SiwsMessage, parseMessage as swisParseMessage } from '@talismn/siws';
import { SigninError } from './enums';
import { getMsaforPublicKey, validateSignature } from './helpers';
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
    if (!isHexString(msg.address)) {
      throw new Error(`${SigninError.InvalidHex}: ${msg.address}`);
    }
    if (!isHexString(signInResponse.siwsPayload.message)) {
      throw new Error(`${SigninError.InvalidHex}: ${signInResponse.siwsPayload.message}`);
    }
    if (!isValidSignature(msg.address, signInResponse.siwsPayload)) {
      throw new Error(`${SigninError.InvalidSignature}: ${signInResponse.siwsPayload.signature}`);
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

export function isValidExpiration(siwsMessage: SiwsMessage): boolean {
  return !!siwsMessage.expirationTime && siwsMessage.expirationTime > Date.now();
}

export async function isValidSignature(address: string, siwsPayload: SiwsPayload): Promise<boolean> {
  if (!isHexString(address)) {
    return false;
  }
  if (!isHexString(siwsPayload.message)) {
    return false;
  }
  return await validateSignature(address, siwsPayload.message, siwsPayload.signature);
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
