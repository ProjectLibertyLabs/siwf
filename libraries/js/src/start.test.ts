import { describe, expect, it } from 'vitest';
import { generateAuthenticationUrl } from './start.js';

describe('generateAuthenticationUrl', () => {
  it('correctly generates the url with a fake signed request and no additionalCallbackUrlParams', async () => {
    expect(generateAuthenticationUrl('testing', '')).toEqual(
      'https://www.frequencyaccess.com/siwa/start?signedRequest=testing'
    );
  });

  it('correctly generates the url with a fake signed request and additionalCallbackUrlParams', async () => {
    expect(generateAuthenticationUrl('testing', 'abc=123')).toEqual(
      'https://www.frequencyaccess.com/siwa/start?abc=123&signedRequest=testing'
    );
  });

  it('correctly generates the url with a fake signed request and additionalCallbackUrlParams when additionalCallbackUrlParams tries to override the signedRequest value', async () => {
    expect(generateAuthenticationUrl('testing', 'signedRequest=123&abc=123')).toEqual(
      'https://www.frequencyaccess.com/siwa/start?signedRequest=testing&abc=123'
    );
  });

  it('correctly generates the url with a fake signed request and additionalCallbackUrlParams when additionalCallbackUrlParams tries to override the authorizationCode value', async () => {
    expect(generateAuthenticationUrl('testing', 'authorizationCode=123&abc=123')).toEqual(
      'https://www.frequencyaccess.com/siwa/start?abc=123&signedRequest=testing'
    );
  });
});
