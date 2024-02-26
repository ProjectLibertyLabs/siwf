export type SiwsPayload = {
  message: string;
  signature: string;
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
  data: SignUpResponse | SignInResponse;
};
