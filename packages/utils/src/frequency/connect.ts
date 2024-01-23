import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { options } from '@frequency-chain/api-augment';

let api: ApiPromise | undefined = undefined;

export const getApi = async (nodeUrl?: string): Promise<ApiPromise> => {
  if (api) return api;

  const rpcEndpoint = nodeUrl || 'http://127.0.0.1:9944/';
  const provider = rpcEndpoint.startsWith('http') ? new HttpProvider(rpcEndpoint) : new WsProvider(rpcEndpoint);

  api = await ApiPromise.create({
    provider,
    throwOnConnect: true,
    throwOnUnknown: true,
    ...options,
  });

  await api.isReadyOrError;

  return api;
};
