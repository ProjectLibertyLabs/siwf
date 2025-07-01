import { isSiwfCredentialsRequest } from './request.js';
import { describe, expect, it } from 'vitest';
import {
  VerifiedEmailAddressCredential,
  VerifiedGraphKeyCredential,
  VerifiedPhoneNumberCredential,
  VerifiedRecoverySecretCredential,
} from '../request.js';

describe('isSiwfCredentialsRequest', () => {
  it('is successful with an empty array', async () => {
    expect(isSiwfCredentialsRequest([])).toBe(true);
  });

  it('is successful with array of requests', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedPhoneNumberCredential,
        VerifiedRecoverySecretCredential,
      ])
    ).toBe(true);
  });

  it('is success with an AnyOf', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedRecoverySecretCredential,
        {
          anyOf: [VerifiedPhoneNumberCredential, VerifiedEmailAddressCredential],
        },
      ])
    ).toBe(true);
  });

  it('is failure with an AllOf', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedRecoverySecretCredential,
        {
          allOf: [VerifiedPhoneNumberCredential, VerifiedEmailAddressCredential],
        },
      ])
    ).toBe(false);
  });

  it('is failure with an OneOf', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedRecoverySecretCredential,
        {
          oneOf: [VerifiedPhoneNumberCredential, VerifiedEmailAddressCredential],
        },
      ])
    ).toBe(false);
  });

  it('is failure with nested', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedRecoverySecretCredential,
        {
          oneOf: [
            VerifiedPhoneNumberCredential,
            {
              allOf: [
                VerifiedEmailAddressCredential,
                {
                  anyOf: [VerifiedEmailAddressCredential, VerifiedEmailAddressCredential],
                },
              ],
            },
          ],
        },
      ])
    ).toBe(false);
  });

  it('is can fail', async () => {
    expect(
      isSiwfCredentialsRequest([
        VerifiedGraphKeyCredential,
        VerifiedRecoverySecretCredential,
        {
          oneOf: [{ foo: 'bar' }],
        },
      ])
    ).toBe(false);
  });
});
