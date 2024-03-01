// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { InjectedWindowProvider } from '@polkadot/extension-inject/types';
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    injectedWeb3?: Record<string, InjectedWindowProvider>;
  }
}

export {};
