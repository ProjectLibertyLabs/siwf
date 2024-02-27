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
  proxyUrl: string;
  frequencyRpcUrl: string;
  schemas: RequestedSchema[];
}

export const defaultConfig: Config = {
  proxyUrl: ProxyUrl.DEV,
  frequencyRpcUrl: Network.LOCALHOST,
  schemas: defaultSchemas,
};
