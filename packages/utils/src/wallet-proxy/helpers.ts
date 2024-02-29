import { ControlPanelResponse, SignInResponse, SignUpResponse } from './types';

export function isSignIn(payload: ControlPanelResponse): payload is SignInResponse {
  return payload?.type === 'sign-in';
}

export function isSignUp(payload: ControlPanelResponse): payload is SignUpResponse {
  return payload?.type === 'sign-up';
}
