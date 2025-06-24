import { isSiwfResponse } from './response.js';
import { ExampleLoginSr25519, ExampleNewProviderSr25519, ExampleNewUserSr25519 } from '../mocks/index.js';
import { describe, expect, it } from 'vitest';

describe('isSiwfResponse', () => {
  it('is successful with ExampleLogin', async () => {
    expect(isSiwfResponse(await ExampleLoginSr25519())).toBe(true);
  });

  it('is successful with ExampleNewUser', async () => {
    expect(isSiwfResponse(await ExampleNewUserSr25519())).toBe(true);
  });

  it('is successful with ExampleNewProvider', async () => {
    expect(isSiwfResponse(await ExampleNewProviderSr25519())).toBe(true);
  });
});
