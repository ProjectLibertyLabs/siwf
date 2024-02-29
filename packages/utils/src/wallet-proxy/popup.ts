import { objectToQueryString } from '../misc_utils';
import { ControlPanelResponse, SignInResponse, SignUpResponse } from './types';
import { Message } from './messenger/enums';
import { getConfig } from './config';
import { SignInRequest, WindowMessenger } from './messenger';

let windowMessenger: WindowMessenger;

export async function renderPopup(src: string, frequencyRpcUrl: string) {
  try {
    windowMessenger = await WindowMessenger.create(
      `${src}/signin?${objectToQueryString({ frequencyRpcUrl })}`,
      'width=600, height=800 screenX=400 screenY=100'
    );
  } catch (error) {
    console.error('Error while creating window messenger', e);
    throw error;
  }
}

export async function getLoginOrRegistrationPayload(): Promise<ControlPanelResponse> {
  const checkPopupClosed = setInterval(function () {
    if (windowMessenger?.childWindow?.closed) {
      clearInterval(checkPopupClosed);
    }
  }, 500);

  let payload;
  try {
    payload = await doGetLoginOrRegistrationPayload();
  } finally {
    if (checkPopupClosed) {
      clearInterval(checkPopupClosed);
    }
    windowMessenger.childWindow?.close();
    windowMessenger.dispose();
  }

  return payload;
}

async function doGetLoginOrRegistrationPayload(): Promise<ControlPanelResponse> {
  const { providerId, proxyUrl, frequencyRpcUrl, schemas } = getConfig();

  const signInRequest: SignInRequest = {
    providerId,
    requiredSchemas: schemas,
  };

  await renderPopup(proxyUrl, frequencyRpcUrl);

  windowMessenger.sendEvent('signinPayload', signInRequest);

  return new Promise((resolve, _reject) => {
    windowMessenger.on(Message.SignInMessage, (data) => {
      const response: ControlPanelResponse = {
        type: 'sign-in',
        data: {
          siwsPayload: data.detail.siwsPayload,
        } as SignInResponse,
      };

      return resolve(response);
    });

    windowMessenger.on(Message.SignUpMessage, (data) => {
      const {
        detail: { encodedClaimHandle, encodedCreateSponsoredAccountWithDelegation },
      } = data;
      const response: ControlPanelResponse = {
        type: 'sign-up',
        data: {
          encodedClaimHandle,
          encodedCreateSponsoredAccountWithDelegation,
        } as SignUpResponse,
      };

      return resolve(response);
    });
  });
}
