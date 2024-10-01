import { SiwfSignedRequest } from './types/request.js';
import { encodeSignedRequest } from './request.js';
import { SiwfOptions } from './types/index.js';
import { parseEndpoint } from './util.js';

/**
 * Generates an Authentication URL for SIWF to start the user's login path.
 *
 * @param {SiwfSignedRequest|string} signedRequest - The signed request object or string.
 * @param {URLSearchParams|string} additionalCallbackUrlParams - The URL parameters to be added to the callback.
 * @param {SiwfOptions} options - Options for endpoint selection.
 *                 options.endpoint - The endpoint to use. Can be specified as 'production' for production environment or 'staging' for test environments.
 *
 * @returns {string} - The generated Authentication URL
 */
export function generateAuthenticationUrl(
  signedRequest: SiwfSignedRequest | string,
  additionalCallbackUrlParams: URLSearchParams | string,
  options?: SiwfOptions
): string {
  const encodedSignedRequest = typeof signedRequest === 'string' ? signedRequest : encodeSignedRequest(signedRequest);
  const endpoint = parseEndpoint(options?.endpoint, '/start');
  const url = new URL(endpoint);
  // Copy over the additionalCallbackUrlParams
  new URLSearchParams(additionalCallbackUrlParams).forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  // Set this last so that it cannot be overridden
  url.searchParams.set('signedRequest', encodedSignedRequest);
  // Remove the reserved keywords, if any
  url.searchParams.delete('authorizationCode');
  return url.toString();
}
