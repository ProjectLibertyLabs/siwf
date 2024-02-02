import { writable } from 'svelte/store';

interface SignupStore {
  address: string;
  name: string;
  handle: string;
}

export const SignupStore = writable<SignupStore>({ address: '', name: '', handle: '' } as SignupStore);
