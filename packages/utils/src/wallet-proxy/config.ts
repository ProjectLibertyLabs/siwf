import { Network, ProxyUrl } from './enums';
import { RequestedSchema } from './messenger';

const defaultSchemas: RequestedSchema[] = [
  {
    name: 'profile',
    id: 0,
  },
  {
    name: 'public-key-key-agreement',
    id: 0,
  },
  {
    name: 'public-follows',
    id: 0,
  },
  {
    name: 'private-follows',
    id: 0,
  },
  {
    name: 'private-connections',
    id: 0,
  },
];

export interface Config {
  providerId: string;
  proxyUrl: string;
  frequencyRpcUrl: string;
  schemas: RequestedSchema[];
}

export const defaultConfig: Config = {
  providerId: '1',
  proxyUrl: ProxyUrl.DEV,
  frequencyRpcUrl: Network.LOCALHOST,
  schemas: defaultSchemas,
};

let currentConfig: Config = defaultConfig;

export const getConfig = (): Config => {
  return currentConfig;
};

export const setConfig = (newConfig: Partial<Config>): void => {
  currentConfig = { ...currentConfig, ...newConfig };
};
