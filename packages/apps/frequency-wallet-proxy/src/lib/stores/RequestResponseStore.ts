import '@frequency-chain/api-augment';
import { type PalletMsaAddProvider } from '@polkadot/types/lookup';
import type {
  EncodedExtrinsic,
  SignInRequest,
  SignInResponse,
  WalletProxyResponse,
} from '@frequency-control-panel/utils';
import { writable } from 'svelte/store';

export type AugmentedSignInRequest = SignInRequest & {
  providerName: string;
  isNewProvider: boolean;
  delegationPayload?: PalletMsaAddProvider;
};

export type RequestResponseData = {
  request: AugmentedSignInRequest;
  response?: WalletProxyResponse;
};

function createRequestResponseStore() {
  const { subscribe, set, update } = writable<RequestResponseData>({
    request: { providerId: '', providerName: '', isNewProvider: true, requiredSchemas: [] },
  });

  return {
    set,
    subscribe,
    update,
    updateDelegationPayload: (payload: PalletMsaAddProvider | undefined) =>
      update((store) => {
        return {
          ...store,
          request: {
            ...store.request,
            delegationPayload: payload,
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
