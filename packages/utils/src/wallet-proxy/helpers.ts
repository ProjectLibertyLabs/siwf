import type {
  AddProviderPayload,
  ClaimHandleParams,
  ClaimHandlePayload,
  Codec,
  EncodedExtrinsic,
  ExtrinsicData,
  SponsoredAccountParams,
  ValidationArgs,
  ValidSignUpPayloads,
} from './types';
import { SignUpCall, SignupError } from './enums';
import { signatureVerify } from '@polkadot/util-crypto';
import { assert, isHex, u8aWrapBytes } from '@polkadot/util';
import type { HexString, U8aLike } from '@polkadot/util/types';
import { ApiPromise } from '@polkadot/api';
import { getBlockNumber } from '../frequency/helpers';

export function isSponsoredAccountParams(
  payload: ClaimHandleParams | SponsoredAccountParams
): payload is SponsoredAccountParams {
  return (payload as SponsoredAccountParams).delegatorKey !== undefined;
}

export function isClaimHandleParams(payload: ClaimHandleParams | SponsoredAccountParams): payload is ClaimHandleParams {
  return (payload as ClaimHandleParams).msaOwnerKey !== undefined;
}

export async function decodeExtrinsic(hexEncodedCall: HexString, api: ApiPromise): Promise<ExtrinsicData> {
  assert(isHex(hexEncodedCall), SignupError.InvalidHex);

  if (!(await api.isReady)) {
    throw new Error(SignupError.ApiNotReady);
  }
  const tx = api.tx(hexEncodedCall);

  const { method, section } = api.registry.findMetaCall(tx.callIndex);

  return { method, section, args: tx.args };
}

export async function validateSignature(publicKey: HexString, proof: HexString, payload: U8aLike): Promise<void> {
  const { isValid } = signatureVerify(u8aWrapBytes(payload), proof, publicKey);
  if (!isValid) {
    throw new Error(SignupError.InvalidSignature);
  }
}

export async function validateSignatureAndCheckExpiration(
  publicKey: HexString,
  proof: HexString,
  payload: Codec,
  expectedExpiration: number,
  api: ApiPromise
): Promise<void> {
  await validateSignature(publicKey, proof, payload.toU8a());
  const currentBlock = await getBlockNumber(api);

  if (currentBlock > expectedExpiration) throw new Error(SignupError.ExpiredSignature);
}

export async function parseValidationArgs(hexEntrinsicCall: HexString, api: ApiPromise): Promise<ValidationArgs> {
  const extrinsicData = await decodeExtrinsic(hexEntrinsicCall, api);
  if (!Object.values(SignUpCall).includes(extrinsicData.method as SignUpCall)) {
    throw new Error(`${SignupError.UnsupportedExtrinsic}: ${extrinsicData.method}`);
  }
  return {
    ...extrinsicData,
    publicKey: extrinsicData.args[0].toHex(),
    proof: extrinsicData.args[1].toHex(),
    payload: extrinsicData.args[2],
  };
}

export async function validateClaimHandleParams(
  hexExtrinsicCall: HexString,
  api: ApiPromise
): Promise<ClaimHandleParams> {
  const { publicKey, proof, payload, method } = await parseValidationArgs(hexExtrinsicCall, api);

  if (method !== SignUpCall.ClaimHandle) {
    throw new Error(`${SignupError.UnsupportedExtrinsic}: ${method}`);
  }

  const claimHandlePayload = payload.toJSON() as unknown as ClaimHandlePayload;
  validateSignatureAndCheckExpiration(publicKey, proof, payload, claimHandlePayload.expiration, api);

  return {
    msaOwnerKey: publicKey,
    proof: proof,
    payload: claimHandlePayload,
  };
}

export async function validateCreateSponsoredAccountWithDelegationParams(
  hexExtrinsicCall: HexString,
  providerMsaId: string,
  api: ApiPromise
): Promise<SponsoredAccountParams> {
  const { publicKey, proof, payload, method } = await parseValidationArgs(hexExtrinsicCall, api);
  if (method !== SignUpCall.CreateSponsoredAccountWithDelegation) {
    throw new Error(`${SignupError.UnsupportedExtrinsic}: ${method}`);
  }

  const addProviderPayload = payload.toJSON() as unknown as AddProviderPayload;
  await validateSignatureAndCheckExpiration(publicKey, proof, payload, addProviderPayload.expiration, api);

  if (providerMsaId !== addProviderPayload.authorizedMsaId) {
    throw new Error(SignupError.InvalidMsaId);
  }

  return {
    delegatorKey: publicKey,
    proof,
    payload: addProviderPayload,
  };
}

export async function validateSignupExtrinsicsParams(
  signupPayload: EncodedExtrinsic[],
  providerMsaId: string,
  api: ApiPromise
): Promise<ValidSignUpPayloads> {
  const initialResponse: ValidSignUpPayloads = {
    publicKey: '0x',
    expiration: Number.MAX_SAFE_INTEGER,
    payloads: {},
    calls: [],
  };

  const finalResponse = await signupPayload.reduce<Promise<ValidSignUpPayloads>>(
    async (accumulatorPromise, extrinsic) => {
      const accumulator = await accumulatorPromise;

      const paramsResult = await validateExtrinsic(extrinsic, providerMsaId, api);

      return updateResponse(accumulator, paramsResult, extrinsic);
    },
    Promise.resolve(initialResponse)
  );

  return finalResponse;
}

async function validateExtrinsic(
  extrinsic: EncodedExtrinsic,
  providerMsaId: string,
  api: ApiPromise
): Promise<ClaimHandleParams | SponsoredAccountParams> {
  switch (extrinsic.extrinsicName) {
    case SignUpCall.CreateSponsoredAccountWithDelegation:
      return await validateCreateSponsoredAccountWithDelegationParams(extrinsic.encodedExtrinsic, providerMsaId, api);
    case SignUpCall.ClaimHandle:
      return await validateClaimHandleParams(extrinsic.encodedExtrinsic, api);
    default:
      throw new Error(`${SignupError.UnsupportedExtrinsic}: ${extrinsic.extrinsicName}`);
  }
}

function updateResponse(
  currentResponse: ValidSignUpPayloads,
  paramsResult: SponsoredAccountParams | ClaimHandleParams,
  extrinsic: EncodedExtrinsic
): ValidSignUpPayloads {
  const publicKey = isSponsoredAccountParams(paramsResult) ? paramsResult.delegatorKey : paramsResult.msaOwnerKey;

  if (currentResponse.publicKey !== '0x' && currentResponse.publicKey !== publicKey) {
    throw new Error(SignupError.SignupKeysMismatch);
  }

  return {
    publicKey,
    expiration: Math.min(paramsResult.payload.expiration, currentResponse.expiration),
    payloads: {
      ...currentResponse.payloads,
      ...(isSponsoredAccountParams(paramsResult)
        ? { addProviderPayload: paramsResult.payload }
        : { claimHandlePayload: paramsResult.payload }),
    },
    calls: sortCallsBySubmissionOrder([...currentResponse.calls, extrinsic]),
  };
}

function sortCallsBySubmissionOrder(encodedExtrinsics: EncodedExtrinsic[]): EncodedExtrinsic[] {
  const orderMap = new Map<SignUpCall, number>([
    [SignUpCall.CreateSponsoredAccountWithDelegation, 0],
    [SignUpCall.ClaimHandle, 1],
  ]);

  return encodedExtrinsics.sort((a, b) => {
    const indexA = orderMap.get(a.extrinsicName as SignUpCall);
    const indexB = orderMap.get(b.extrinsicName as SignUpCall);
    return (indexA as number) - (indexB as number);
  });
}
