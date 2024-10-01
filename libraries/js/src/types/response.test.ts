import { isSiwfResponse } from './response.js';
import { ExampleLogin, ExampleNewProvider, ExampleNewUser } from '../mocks/index.js';
import { describe, expect, it } from 'vitest';

describe('isSiwfResponse', () => {
  it('is successful with ExampleLogin', async () => {
    expect(isSiwfResponse(await ExampleLogin())).toBe(true);
  });

  it('is successful with ExampleNewUser', async () => {
    expect(isSiwfResponse(await ExampleNewUser())).toBe(true);
  });

  it('is successful with ExampleNewProvider', async () => {
    expect(isSiwfResponse(await ExampleNewProvider())).toBe(true);
  });
});
