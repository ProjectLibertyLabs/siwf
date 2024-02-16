import { writable } from 'svelte/store';
import { validateHandle } from '@frequency-control-panel/utils';
import { checkHandleAvailability } from '../utils';

const createHandleStore = () => {
  const { subscribe, set } = writable({ isValid: false, isAvailable: false });

  return {
    subscribe,
    validateAndSet: async (handle) => {
      const isValid = await validateHandle(handle);
      const isAvailable = await checkHandleAvailability(handle);

      set({ isValid, isAvailable });
    },
  };
};

export const HandleStore = createHandleStore();
