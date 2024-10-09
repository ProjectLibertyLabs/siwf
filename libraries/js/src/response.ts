import { cryptoWaitReady } from '@polkadot/util-crypto';
import base64url from 'base64url';
import { SiwfOptions } from './types/general.js';
import { isSiwfResponse, SiwfResponse } from './types/response.js';
import { parseEndpoint } from './util.js';
import { validateCredentials } from './credentials.js';
import { validatePayloads } from './payloads.js';

type MakePropertyRequired<T, K extends keyof T> = Partial<T> & Pick<Required<T>, K>;

/**
 * Checks to see if there are any chain submissions in the result
 *
 * @param {SiwfResponse} result - The result from the login
 *
 * @returns {boolean}
 */
export function hasChainSubmissions(result: SiwfResponse): boolean {
  // Anything that has an endpoint is a chain submission
  return !!result.payloads.find((x) => !!x.endpoint);
}

/**
 * Validate a possible SIWF Response
 *
 * @param {unknown} response - A possible SIWF Response.
 * @param {string} loginMsgDomain - The login message signed by the user should match this domain. (Default: localhost)
 *
 * @returns {Promise<SiwfResponse>} The validated response
 */
export async function validateSiwfResponse(response: unknown, loginMsgDomain: string): Promise<SiwfResponse> {
  await cryptoWaitReady();

  let body = response;
  if (typeof response === 'string') {
    try {
      body = JSON.parse(base64url.decode(response));
    } catch (_e) {
      throw new Error(`Response failed to correctly parse: ${response}`);
    }
  }

  // This also validates that userPublicKey is a valid address
  if (!isSiwfResponse(body)) {
    throw new Error(`Response failed to correctly parse or invalid content: ${JSON.stringify(body)}`);
  }

  // Validate Payloads
  await validatePayloads(body, loginMsgDomain);

  // Validate Credentials (if any), but trust DIDs from frequencyAccess
  await validateCredentials(body.credentials, ['did:web:frequencyaccess.com', 'did:web:testnet.frequencyaccess.com']);

  return body;
}

/**
 * Fetch and extract the Result of the Login from Frequency Access
 *
 * @param {string} authorizationCode - The code from the callback URI parameters.
 * @param {SiwfOptions} options - Options for endpoint selection and domain checks.
 *                 options.endpoint - The endpoint to use. Can be specified as 'production' for production environment or 'staging' for test environments.
 *                 options.loginMsgDomain - The login message signed by the user should match this domain. (Default: localhost)
 *
 * @returns {Promise<SiwfResponse>} The parsed and validated response
 */
export async function getLoginResult(
  authorizationCode: string,
  options: MakePropertyRequired<SiwfOptions, 'loginMsgDomain'>
): Promise<SiwfResponse> {
  const endpoint = new URL(
    `${parseEndpoint(options?.endpoint, '/api/payload')}?authorizationCode=${authorizationCode}`
  );
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Response failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  return validateSiwfResponse(body, options.loginMsgDomain);
}
