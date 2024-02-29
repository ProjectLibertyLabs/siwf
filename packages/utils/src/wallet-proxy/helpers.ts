import { ControlPanelResponse, SignInResponse, SignUpResponse } from './types';

export function isSignIn(payload: ControlPanelResponse): payload is SignInResponse {
  return (payload as SignInResponse).siwsPayload !== undefined;
}

export function isSignUp(payload: ControlPanelResponse): payload is SignUpResponse {
  return (
    (payload as SignUpResponse).encodedClaimHandle !== undefined ||
    (payload as SignUpResponse).encodedCreateSponsoredAccountWithDelegation !== undefined
  );
}
