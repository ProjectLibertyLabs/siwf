import type { InjectedWeb3 } from '@frequency-control-panel/utils';
import { writable } from 'svelte/store';

let resolve: (arg: InjectedWeb3) => void;
export const awaitWeb3Ready = new Promise<InjectedWeb3>((res: (arg: InjectedWeb3) => void) => {
  resolve = res;
});

export const Web3Store = (() => {
  const { set, ...rest } = writable<InjectedWeb3 | undefined>();
  return {
    ...rest,
    set: (value: InjectedWeb3 | undefined) => {
      set(value);
      if (!!value) {
        console.dir({ msg: 'Resolving web3', value });
        resolve(value);
      }
    },
  };
})();
