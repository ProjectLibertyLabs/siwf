import { Message } from './messenger/enums';

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

export class WalletProxyResponseEvent extends Event {
  public readonly detail: WalletProxyResponse;

  constructor(detail: WalletProxyResponse) {
    super(Message.WalletProxyResponseMessage);
    this.detail = detail;
  }
}
