/*!
 * Forked from Digital Bazaar, Inc.
 * https://github.com/digitalbazaar/eddsa-rdfc-2022-cryptosuite
 */
import { canonize } from './canonize.js';
import { createVerifier } from './createVerifier.js';
import { name } from './name.js';
import { requiredAlgorithm } from './requiredAlgorithm.js';

export const cryptosuite = {
  canonize,
  createVerifier,
  name,
  requiredAlgorithm,
};
