import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { options } from '@frequency-chain/api-augment';

let api: Promise<ApiPromise>;
let nodeResolve: ((value: string) => void) | undefined;
const rpcNodeUrl = new Promise<string>((resolve) => {
  nodeResolve = resolve;
});

export function setApiUrl(u: string) {
  console.log('Setting chain URL to ', u);
  if (nodeResolve) {
    nodeResolve(u);
    nodeResolve = undefined;
  }
}

export function getApiUrl(): Promise<string> {
  return rpcNodeUrl;
}

/// Return a promise that will not resolve until:
///   - the chain URL is set
///   - the chain is successfully connected
export async function getApi(): Promise<ApiPromise> {
  if (!api) {
    const url = await rpcNodeUrl;
    api = new Promise<ApiPromise>((resolve, reject) => {
      console.log('Connecting to ', url);
      const provider = url.startsWith('http') ? new HttpProvider(url) : new WsProvider(url);

      ApiPromise.create({
        provider,
        throwOnConnect: true,
        throwOnUnknown: true,
        ...options,
      })
        .then((value) => value.isReadyOrError)
        .then((readyApi) => {
          resolve(readyApi);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  return api;
}
