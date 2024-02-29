import type { SignInRequest, SignInResponse, SignUpResponse } from '@frequency-control-panel/utils';
import { writable } from 'svelte/store';

export type AugmentedSignInRequest = SignInRequest & {
  providerName: string;
};

export type RequestResponseData = {
  request: AugmentedSignInRequest;
  response?: { signIn?: SignInResponse; signUp?: SignUpResponse };
};

function createRequestResponseStore() {
  const { subscribe, set, update } = writable<RequestResponseData>({
    request: { providerId: '', providerName: '', requiredSchemas: [] },
  });

  return {
    set,
    subscribe,
    update,
    updateSignInResponse: (newSignInResponse: SignInResponse) =>
      update((store) => ({
        ...store,
        response: { ...store.response, signIn: newSignInResponse },
      })),
    updateEncodedClaimHandle: (newEncodedClaimHandle: `0x${string}`) =>
      update((store) => ({
        ...store,
        response: {
          ...store.response,
          signUp: { ...store.response?.signUp, encodedClaimHandle: newEncodedClaimHandle },
        },
      })),
    updateEncodedCreateSponsoredAccountWithDelegation: (
      newEncodedCreateSponsoredAccountWithDelegation: `0x${string}`
    ) =>
      update((store) => ({
        ...store,
        response: {
          ...store.response,
          signUp: {
            ...store.response?.signUp,
            encodedCreateSponsoredAccountWithDelegation: newEncodedCreateSponsoredAccountWithDelegation,
          },
        },
      })),
  };
}

export const RequestResponseStore = createRequestResponseStore();
