import { Message } from './messenger/enums';
import type { AnyTuple, Codec as PCodec } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

export type Codec = PCodec;

export type SiwsPayload = {
  message: string;
  signature: `0x${string}`;
};

export type ErrorResponse = {
  message: string;
};

export type SignInResponse = {
  siwsPayload?: SiwsPayload;
  error?: ErrorResponse;
};

export type EncodedExtrinsic = {
  pallet: string;
  extrinsicName: string;
  encodedExtrinsic: `0x${string}`;
};

export type SignUpResponse = {
  extrinsics?: EncodedExtrinsic[];
  error?: ErrorResponse;
};

export type WalletProxyResponse = {
  signIn?: SignInResponse;
  signUp?: SignUpResponse;
};

export interface ExtrinsicData {
  method: string;
  section: string;
  args: AnyTuple;
}

export interface AddProviderPayload {
  authorizedMsaId: string;
  schemaIds: number[];
  expiration: number;
}

export interface SponsoredAccountParams {
  delegatorKey: HexString;
  proof: HexString;
  payload: AddProviderPayload;
}

export interface ClaimHandlePayload {
  baseHandle: string;
  expiration: number;
}

export interface ClaimHandleParams {
  msaOwnerKey: HexString;
  proof: string;
  payload: ClaimHandlePayload;
}

export interface ValidationArgs {
  publicKey: HexString;
  proof: HexString;
  payload: Codec;
  section: string;
  method: string;
}

export interface ValidSignUpPayloads {
  publicKey: HexString;
  expiration: number;
  payloads: {
    addProviderPayload?: AddProviderPayload;
    claimHandlePayload?: ClaimHandlePayload;
  };
  calls: EncodedExtrinsic[];
}

export class WalletProxyResponseEvent extends Event {
  public readonly detail: WalletProxyResponse;

  constructor(detail: WalletProxyResponse) {
    super(Message.WalletProxyResponseMessage);
    this.detail = detail;
  }
}
