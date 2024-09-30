import { cryptoWaitReady } from '@polkadot/util-crypto';
import { SiwfOptions } from './types/general.js';
import { isSiwfResponse, SiwfResponse } from './types/response.js';
import { parseEndpoint } from './util.js';
import { validateCredentials } from './credentials.js';
import { validatePayloads } from './payloads.js';

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
 * Fetch and extract the Result of the Login from Frequency Access
 *
 * @param {string} authorizationCode - The code from the callback URI parameters.
 * @param {SiwfOptions} options - Options for endpoint selection.
 *                 options.endpoint - The endpoint to use. Can be specified as 'production' for production environment or 'staging' for test environments.
 *
 * @returns {Promise<SiwfResponse>} The parsed and validated response
 */
export async function getLoginResult(authorizationCode: string, options?: SiwfOptions): Promise<SiwfResponse> {
  await cryptoWaitReady();
  const endpoint = new URL(
    `${parseEndpoint(options?.endpoint, '/api/payload')}?authorizationCode=${authorizationCode}`
  );
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Response failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  // This also validates that userPublicKey is a valid address
  if (!isSiwfResponse(body)) {
    throw new Error(`Response failed to correctly parse or invalid content: ${await response.text()}`);
  }

  // Validate Payloads
  await validatePayloads(body);

  // Validate Credentials (if any), but trust DIDs from frequencyAccess
  await validateCredentials(body.credentials, ['did:web:frequencyaccess.com', 'did:web:testnet.frequencyaccess.com']);

  return body;
}
