import { readable } from 'svelte/store';
import { extensionsConfig } from '../components';

export const ConfiguredExtensionsStore = readable(extensionsConfig);
