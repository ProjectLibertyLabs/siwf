import { storable } from './storable';
import type { AccountWithMsaInfo } from '../components';

export const CurrentSelectedAccountWithMsaStore = storable<AccountWithMsaInfo>('AccountWithMsaInfo');
