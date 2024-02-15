import { Schema } from './enums';
import { SiwsMessage } from 'siws-message'; // Import the necessary module or type declaration for 'SiwsMessage'

export interface SignInRequest {
  providerId: string;
  schemas: [Schema];
  siwsOptions: {
    statement?: string;
    requestId?: string; // any value that
    resources?: [URL];
    expirationTimeOffsetSeconds: number; //expiration time is how long its valid for after its signed
    notBefore?: number; // milliseconds date
  };
}

export interface SignInResponse {
  isSignedIn: boolean;
    siwsPayload: {
        signature: string;
        payload: SiwsMessage; // reference talisman library (siws message)
    };
  signup: {
    public_key: string;
    handle: {
      payload: ClaimHandlePayload;
      signature: string;
    };
    delgation: {
      isNewAccount: boolean;
      payload: addProviderPayload;
      signature: {};
    };
  };
}
