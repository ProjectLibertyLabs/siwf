import { checkHandleAvailability, getHandlePayload } from '$lib/utils';
import { validateHandle } from '@frequency-control-panel/utils';
import { writable } from 'svelte/store';

interface SignupStoreData {
  address: string;
  name: string;
  handle: {
    baseHandle: string;
    isValid: boolean;
    isAvailable: boolean;
    payload: Awaited<ReturnType<typeof getHandlePayload>>;
  };
}

function createSignupStore() {
  const { subscribe, update, set } = writable<SignupStoreData>({
    address: '',
    name: '',
    handle: {
      baseHandle: '',
      isAvailable: false,
      isValid: false,
      payload: {
        raw: { baseHandle: '', expiration: 0 },
        bytes: new Uint8Array(),
      },
    },
  });

  return {
    set,
    subscribe,
    update,
    updateAddress: (newAddress: string) => {
      update((store) => ({ ...store, handle: { ...store.handle }, address: newAddress }));
    },
    updateHandle: (newHandle: string) =>
      update((store) => ({ ...store, handle: { ...store.handle, baseHandle: newHandle } })),
    validateAndSetHandleStatus: async (baseHandle: string) => {
      const [isValid, isAvailable] = await Promise.all([
        validateHandle(baseHandle),
        checkHandleAvailability(baseHandle),
      ]);
      update((store) => ({ ...store, handle: { ...store.handle, isAvailable, isValid } }));
    },
  };
}

export const SignupStore = createSignupStore();
