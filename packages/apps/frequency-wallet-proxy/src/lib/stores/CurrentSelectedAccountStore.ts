import type { MsaInfo } from '@frequency-control-panel/utils';
import { storable } from './storable';
import type { InjectedAccountWithExtensions } from '.';

export interface CurrentSelectedMsaAccount extends MsaInfo {
  account: InjectedAccountWithExtensions;
}

export const CurrentSelectedMsaAccountStore = storable<CurrentSelectedMsaAccount>('SelectedMsaAccount');
