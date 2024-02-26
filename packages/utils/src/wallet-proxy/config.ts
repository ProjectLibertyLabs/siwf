import { Network, ProxyUrl, Schema } from './enums';

const defaultSchemas: Schema[] = [
  Schema.TOMBSTORE,
  Schema.BROADCAST,
  Schema.REPLAY,
  Schema.REACTION,
  Schema.PROFILE,
  Schema.UPDATE,
  Schema.PUBLIC_KEY,
  Schema.PUBLIC_FOLLOWS,
  Schema.PRIVATE_FOLLOWS,
  Schema.PRIVATE_CONNECTIONS,
];

export interface Config {
  proxyUrl: string;
  rpc: string;
  schemas: Schema[];
}

export const defaultConfig: Config = {
  proxyUrl: ProxyUrl.DEV,
  rpc: Network.LOCALHOST,
  schemas: defaultSchemas,
};

let currentConfig: Config = defaultConfig;

export const getConfig = (): Config => {
  return currentConfig;
};

export const setConfig = (newConfig: Partial<Config>): void => {
  currentConfig = { ...currentConfig, ...newConfig };
};
