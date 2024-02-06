import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function mapAwareReplacer(_: string, value: unknown): unknown {
  if (value instanceof Map) {
    return Array.from(value.entries());
  }

  return value;
}

export function storable<T>(key: string, data?: T) {
  const store = writable(data);
  const { subscribe, set, update } = store;
  const storage = browser ? window.localStorage : null;

  if (storage) {
    const storageValue = storage.getItem(key);
    if (!!storageValue) {
      set(storageValue ? JSON.parse(storageValue) : data);
    }
  }

  return {
    subscribe,
    set: (n: T) => {
      storage && storage.setItem(key, JSON.stringify(n, mapAwareReplacer));
      set(n);
    },
    update: (cb: (value: T) => T) => {
      const new_cb = (old_value: T) => {
        const new_value = cb(old_value);

        storage && storage.setItem(key, JSON.stringify(new_value, mapAwareReplacer));
        return new_value;
      };
      update(new_cb);
    },
  };
}
