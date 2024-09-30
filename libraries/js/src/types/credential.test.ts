import { ExampleEmailCredential, ExamplePhoneCredential, ExampleUserGraphCredential } from '../mocks/credentials.js';
import { describe, expect, it } from 'vitest';
import { isCredentialEmail, isCredentialGraph, isCredentialPhone, isCredentials } from './credential.js';

describe('isCredentials Single', () => {
  it('is successful with ExampleUserGraphCredential', async () => {
    expect(isCredentialGraph(await ExampleUserGraphCredential())).toBe(true);
    expect(isCredentials([await ExampleUserGraphCredential()])).toBe(true);
  });

  it('is successful with ExampleEmailCredential', async () => {
    expect(isCredentialEmail(await ExampleEmailCredential())).toBe(true);
    expect(isCredentials([await ExampleEmailCredential()])).toBe(true);
  });

  it('is successful with ExamplePhoneCredential', async () => {
    expect(isCredentialPhone(await ExamplePhoneCredential())).toBe(true);
    expect(isCredentials([await ExamplePhoneCredential()])).toBe(true);
  });
});

describe('isCredentials Multi', () => {
  it('is successful with all types', async () => {
    expect(
      isCredentials([
        await ExampleEmailCredential(),
        await ExamplePhoneCredential(),
        await ExampleUserGraphCredential(),
      ])
    ).toBe(true);
  });

  it('will fail with a bad one', async () => {
    expect(isCredentials([await ExampleEmailCredential(), {}])).toBe(false);
  });
});
