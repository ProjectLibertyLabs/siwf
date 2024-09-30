import { isSiwaResponse } from './response.js';
import { ExampleLogin, ExampleNewProvider, ExampleNewUser } from '../mocks/index.js';
import { describe, expect, it } from 'vitest';

describe('isSiwaResponse', () => {
  it('is successful with ExampleLogin', async () => {
    expect(isSiwaResponse(await ExampleLogin())).toBe(true);
  });

  it('is successful with ExampleNewUser', async () => {
    expect(isSiwaResponse(await ExampleNewUser())).toBe(true);
  });

  it('is successful with ExampleNewProvider', async () => {
    expect(isSiwaResponse(await ExampleNewProvider())).toBe(true);
  });
});
