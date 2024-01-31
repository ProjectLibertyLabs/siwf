import { writable } from 'svelte/store';

export function writable_storage<T>(storage: Storage, key: string, data?: T, start = () => {}) {
  const store = writable(data, start);
  const { subscribe, set, update } = store;
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && storage) {
    const storageValue = storage.getItem(key);
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!storageValue) {
      set(storageValue ? JSON.parse(storageValue) : data);
    }
  }

  return {
    subscribe,
    set: (n: T) => {
      isBrowser && storage.setItem(key, JSON.stringify(n));
      set(n);
    },
    update: (cb: (value: T) => T) => {
      const new_cb = (old_value: T) => {
        const new_value = cb(old_value);
        isBrowser && storage.setItem(key, JSON.stringify(new_value));
        return new_value;
      };
      update(new_cb);
    },
  };
}
