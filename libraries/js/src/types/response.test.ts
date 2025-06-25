import { isSiwfResponse } from './response.js';
import {
  ExampleLoginSecp256k1,
  ExampleLoginSr25519,
  ExampleNewProviderSecp256k1,
  ExampleNewProviderSr25519,
  ExampleNewUserSecp256k1,
  ExampleNewUserSr25519,
} from '../mocks/index.js';
import { describe, expect, it } from 'vitest';

describe('isSiwfResponse', () => {
  it('is successful with ExampleLogin Sr25519', async () => {
    expect(isSiwfResponse(await ExampleLoginSr25519())).toBe(true);
  });

  it('is successful with ExampleNewUser Sr25519', async () => {
    expect(isSiwfResponse(await ExampleNewUserSr25519())).toBe(true);
  });

  it('is successful with ExampleNewProvider Sr25519', async () => {
    expect(isSiwfResponse(await ExampleNewProviderSr25519())).toBe(true);
  });

  it('is successful with ExampleLogin Secp256k1', async () => {
    expect(isSiwfResponse(await ExampleLoginSecp256k1())).toBe(true);
  });

  it('is successful with ExampleNewUser Secp256k1', async () => {
    expect(isSiwfResponse(await ExampleNewUserSecp256k1())).toBe(true);
  });

  it('is successful with ExampleNewProvider Secp256k1', async () => {
    expect(isSiwfResponse(await ExampleNewProviderSecp256k1())).toBe(true);
  });
});
