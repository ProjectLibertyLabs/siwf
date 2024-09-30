/*!
 * Forked from Digital Bazaar, Inc.
 * https://github.com/digitalbazaar/eddsa-rdfc-2022-cryptosuite
 */
import { from } from '@digitalbazaar/ed25519-multikey';

export async function createVerifier({ verificationMethod }: { verificationMethod: object }) {
  const key = await from(verificationMethod);
  const verifier = key.verifier();
  return verifier;
}
