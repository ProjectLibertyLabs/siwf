import { isArrayOf, isNum, isObj, isStr } from './general.js';
import { SiwfResponse } from './response.js';

interface SiwfResponsePayloadEndpoint {
  pallet: string;
  extrinsic: string;
}

interface SiwfResponsePayloadBase {
  signature: {
    algo: 'Sr25519';
    encoding: 'base16';
    encodedValue: string;
  };
  endpoint?: SiwfResponsePayloadEndpoint;
  type: string;
  payload: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadSignature(obj: any): obj is SiwfResponsePayloadBase['signature'] {
  return isObj(obj) && obj.algo === 'Sr25519' && obj.encoding == 'base16' && isStr(obj.encodedValue);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadEndpoint(obj: any): obj is SiwfResponsePayloadEndpoint {
  return isObj(obj) && isStr(obj.pallet) && isStr(obj.extrinsic);
}

export interface SiwfResponsePayloadLogin extends SiwfResponsePayloadBase {
  type: 'login';
  payload: {
    message: string;
  };
}

export interface SiwfResponsePayloadAddProvider extends SiwfResponsePayloadBase {
  endpoint: {
    pallet: 'msa';
    extrinsic: 'createSponsoredAccountWithDelegation' | 'grantDelegation';
  };
  type: 'addProvider';
  payload: {
    authorizedMsaId: number;
    schemaIds: number[];
    expiration: number;
  };
}

export interface SiwfResponsePayloadItemActions extends SiwfResponsePayloadBase {
  endpoint: {
    pallet: 'statefulStorage';
    extrinsic: 'applyItemActionsWithSignatureV2';
  };
  type: 'itemActions';
  payload: {
    schemaId: number;
    targetHash: number;
    expiration: number;
    actions: {
      type: 'addItem';
      payloadHex: string;
    }[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadItemActionsPayloadAction(obj: any): obj is SiwfResponsePayloadItemActions['payload']['actions'] {
  return isObj(obj) && obj.type === 'addItem' && isStr(obj.payloadHex);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadItemActionsPayload(obj: any): obj is SiwfResponsePayloadItemActions['payload'] {
  return (
    isObj(obj) &&
    isNum(obj.schemaId) &&
    isNum(obj.targetHash) &&
    isNum(obj.expiration) &&
    isArrayOf(obj.actions, isPayloadItemActionsPayloadAction)
  );
}

export interface SiwfResponsePayloadClaimHandle extends SiwfResponsePayloadBase {
  endpoint: {
    pallet: 'handles';
    extrinsic: 'claimHandle';
  };
  type: 'claimHandle';
  payload: {
    baseHandle: string;
    expiration: number;
  };
}

export type SiwfResponsePayload =
  | SiwfResponsePayloadAddProvider
  | SiwfResponsePayloadItemActions
  | SiwfResponsePayloadClaimHandle
  | SiwfResponsePayloadBase;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadBase(obj: any): obj is SiwfResponsePayloadBase {
  return isObj(obj) && isStr(obj.type) && isPayloadSignature(obj.signature) && isObj(obj.payload);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPayloadLogin(obj: any): obj is SiwfResponsePayloadLogin {
  return isPayloadBase(obj) && obj.type === 'login' && isStr(obj.payload.message);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPayloadClaimHandle(obj: any): obj is SiwfResponsePayloadClaimHandle {
  return (
    isPayloadBase(obj) &&
    obj.type === 'claimHandle' &&
    isPayloadEndpoint(obj.endpoint) &&
    obj.endpoint.pallet === 'handles' &&
    obj.endpoint.extrinsic === 'claimHandle' &&
    isStr(obj.payload.baseHandle) &&
    isNum(obj.payload.expiration)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPayloadItemActions(obj: any): obj is SiwfResponsePayloadItemActions {
  return (
    isPayloadBase(obj) &&
    obj.type === 'itemActions' &&
    isObj(obj.endpoint) &&
    obj.endpoint.pallet === 'statefulStorage' &&
    obj.endpoint.extrinsic === 'applyItemActionsWithSignatureV2' &&
    isPayloadItemActionsPayload(obj.payload)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPayloadAddProvider(obj: any): obj is SiwfResponsePayloadAddProvider {
  return (
    isPayloadBase(obj) &&
    obj.type === 'addProvider' &&
    isPayloadEndpoint(obj.endpoint) &&
    obj.endpoint.pallet === 'msa' &&
    ['createSponsoredAccountWithDelegation', 'grantDelegation'].includes(obj.endpoint.extrinsic) &&
    isNum(obj.payload.authorizedMsaId) &&
    isArrayOf(obj.payload.schemaIds, isNum)
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPayloadItem(obj: any): obj is SiwfResponsePayload {
  return isPayloadLogin(obj) || isPayloadClaimHandle(obj) || isPayloadItemActions(obj) || isPayloadAddProvider(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPayloads(obj: any): obj is SiwfResponse['payloads'] {
  return isArrayOf(obj, isPayloadItem);
}
