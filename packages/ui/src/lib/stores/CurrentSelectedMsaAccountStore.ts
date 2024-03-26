import { writable } from 'svelte/store';
import { type MsaInfo } from '@amplica-labs/siwf-utils';
import type { InjectedAccountWithExtensions } from './derived/AllAccountsDerivedStore';

export interface CurrentSelectedMsaAccount extends MsaInfo {
  account: InjectedAccountWithExtensions;
}

export const CurrentSelectedMsaAccountStore = writable<CurrentSelectedMsaAccount>();
