import { Network, ProxyUrl } from './enums.js';
import { RequestedSchema, type SiwsOptions } from './messenger';

const defaultSchemas: RequestedSchema[] = [
  {
    name: 'profile',
  },
  {
    name: 'public-key-key-agreement',
  },
  {
    name: 'public-follows',
  },
  {
    name: 'private-follows',
  },
  {
    name: 'private-connections',
  },
];

export interface Config {
  providerId: string;
  proxyUrl: string;
  frequencyRpcUrl: string;
  schemas: RequestedSchema[];
  siwsOptions?: SiwsOptions;
}

export const defaultConfig: Config = {
  providerId: '',
  proxyUrl: ProxyUrl.DEV,
  frequencyRpcUrl: Network.LOCALHOST,
  schemas: defaultSchemas,
  siwsOptions: {
    expiresInMsecs: 300_000, // 5 minutes
  },
};

let currentConfig: Config = defaultConfig;

export const getConfig = (): Config => {
  return currentConfig;
};

export const setConfig = (newConfig: Partial<Config>): void => {
  currentConfig = { ...currentConfig, ...newConfig };
};
