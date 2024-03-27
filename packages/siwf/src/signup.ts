import '@frequency-chain/api-augment';
import type { SignUpResponse, ValidSignUpPayloads } from './types';
import { SignupError } from './enums';
import { ApiPromise } from '@polkadot/api';
import { validateSignupExtrinsicsParams } from './helpers';

/**
 * Validates the signup and throws an error if the validation fails.
 */
export async function validateSignup(
  api: ApiPromise,
  signupResponse: SignUpResponse,
  providerMsaId: string
): Promise<ValidSignUpPayloads> {
  if (signupResponse.extrinsics) {
    return validateSignupExtrinsicsParams(signupResponse.extrinsics, providerMsaId, api);
  }
  throw new Error(`${SignupError.ResponseError}: ${signupResponse.error || 'Unknown Error'}`);
}
