import { type SignInRequest } from '@frequency-control-panel/utils';
import { writable } from 'svelte/store';

export type AugmentedSignInRequest = SignInRequest & {
  providerName: string;
};

export type RequestResponseData = {
  request: AugmentedSignInRequest;
  response?: unknown;
};

export const RequestResponseStore = writable<RequestResponseData>({
  request: { providerId: '', providerName: '', requiredSchemas: [] },
});
