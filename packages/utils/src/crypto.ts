import { randomStringForEntropy } from '@stablelib/random';

export function generateSIWxNonce(): string {
  // See https://github.com/spruceid/siwe/blob/4e86ad7d87afd31870ce2f93722df63e81da9126/packages/siwe/lib/utils.ts#L41
  const nonce = randomStringForEntropy(96);
  return nonce;
}
