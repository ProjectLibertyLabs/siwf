import type { AccountWithMsaInfo } from '../components';
import { storable } from './storable';

export const CurrentSelectedAccountWithMsaStore = storable<AccountWithMsaInfo>('AccountWithMsaInfo');
