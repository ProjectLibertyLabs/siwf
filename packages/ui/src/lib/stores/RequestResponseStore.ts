import '@frequency-chain/api-augment';
import type { EncodedExtrinsic, SignInRequest, SignInResponse, WalletProxyResponse } from '@AmplicaLabs/siwf-utils';
import { writable } from 'svelte/store';

export type AugmentedSignInRequest = SignInRequest & {
  providerName: string;
  isNewProvider: boolean;
  missingSchemas: number[];
  allSchemasToGrant: number[];
};

export type RequestResponseData = {
  request: AugmentedSignInRequest;
  response?: WalletProxyResponse;
};

function createRequestResponseStore() {
  const { subscribe, set, update } = writable<RequestResponseData>({
    request: {
      frequencyRpcUrl: '',
      providerId: '',
      providerName: '',
      isNewProvider: true,
      requiredSchemas: [],
      missingSchemas: [],
      allSchemasToGrant: [],
    },
  });

  return {
    set,
    subscribe,
    update,
    updateDelegation: (isNewProvider: boolean, missingSchemas: number[], allSchemasToGrant: number[]) =>
      update((store) => {
        return {
          ...store,
          request: {
            ...store.request,
            isNewProvider,
            missingSchemas,
            allSchemasToGrant,
          },
        };
      }),
    upsertExtrinsic: (extrinsic: EncodedExtrinsic) =>
      update((store) => {
        const extrinsics = store?.response?.signUp?.extrinsics || [];
        const entry = extrinsics.find(
          (e) => e.pallet === extrinsic.pallet && e.extrinsicName === extrinsic.extrinsicName
        );
        if (entry) {
          entry.encodedExtrinsic = extrinsic.encodedExtrinsic;
        } else {
          extrinsics.push(extrinsic);
        }
        // Make sure 'msa' pallet extrinsics are first (to make sure we create an account before claiming a handle)
        extrinsics.sort((a, b) => {
          if (a.pallet === b.pallet) {
            return 0;
          } else if (a.pallet === 'msa') {
            return -1;
          } else if (b.pallet === 'msa') {
            return 1;
          }

          return 0;
        });

        return { ...store, response: { ...store?.response, signUp: { ...store?.response?.signUp, extrinsics } } };
      }),
    updateSignInResponse: (newSignInResponse: SignInResponse) =>
      update((store) => ({
        ...store,
        response: { ...store.response, signIn: newSignInResponse },
      })),
  };
}

export const RequestResponseStore = createRequestResponseStore();
