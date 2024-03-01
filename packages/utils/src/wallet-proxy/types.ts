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

export type SignUpResponse = {
  encodedClaimHandle?: `0x${string}`;
  encodedCreateSponsoredAccountWithDelegation?: `0x${string}`;
  error?: ErrorResponse;
};

export type ControlPanelResponse = (SignInResponse | SignUpResponse) & {
  type?: 'sign-in' | 'sign-up';
};

export class SignInEvent extends Event {
  public readonly detail: SignInResponse;

  constructor(detail: SignInResponse) {
    super(Message.SignInMessage);
    this.detail = detail;
  }
}

export class SignUpEvent extends Event {
  public readonly detail: SignUpResponse;

  constructor(detail: SignUpResponse) {
    super(Message.SignUpMessage);
    this.detail = detail;
  }
}
