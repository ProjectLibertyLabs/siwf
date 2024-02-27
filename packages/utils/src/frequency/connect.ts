import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { options } from '@frequency-chain/api-augment';

const FALLBACK_URL = 'http://127.0.0.1:9944/';

let api: ApiPromise | undefined = undefined;
let rpcNodeUrl: string | null;

export function setApiUrl(u: string | null) {
  rpcNodeUrl = u;
}

export async function getApi(newUrl?: string): Promise<ApiPromise> {
  if (api && (!newUrl || newUrl === rpcNodeUrl)) return api;
  if (api) {
    await api.disconnect();
    api = undefined;
  }

  rpcNodeUrl = newUrl || rpcNodeUrl || FALLBACK_URL;
  const provider = rpcNodeUrl.startsWith('http') ? new HttpProvider(rpcNodeUrl) : new WsProvider(rpcNodeUrl);

  api = await ApiPromise.create({
    provider,
    throwOnConnect: true,
    throwOnUnknown: true,
    ...options,
  });

  await api.isReadyOrError;

  return api;
}
