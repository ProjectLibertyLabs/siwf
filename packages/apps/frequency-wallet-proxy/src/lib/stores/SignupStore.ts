import { writable } from 'svelte/store';

interface SignupStore {
  address: string;
  name: string;
  handle: string;
}

function createSignupStore() {
  const { subscribe, update, set } = writable<SignupStore>({ address: '', name: '', handle: '' });

  return {
    set,
    subscribe,
    updateAddress: (newAddress: string) => update((store) => ({ ...store, address: newAddress })),
    updateHandle: (newHandle: string) => update((store) => ({ ...store, handle: newHandle })),
  };
}

export const SignupStore = createSignupStore();
