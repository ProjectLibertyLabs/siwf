import { storable } from './storable';

const STORAGE_KEY = 'SelectedExtension';

export const CurrentSelectedExtensionIdStore = storable<string>(STORAGE_KEY);
