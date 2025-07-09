/*
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import { sha256 } from '@noble/hashes/sha2.js'; // ESM & Common.js

/**
 * Hashes a string of data using SHA-256.
 *
 * @param {string} string - The string to hash.
 *
 * @returns {Uint8Array} The hash digest.
 */
export async function sha256digest({ string }: { string: string }): Promise<Uint8Array> {
  return sha256(string);
}
