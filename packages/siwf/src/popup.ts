import { WalletProxyResponse, WalletProxyResponseEvent } from './types';
import { Message } from './messenger/enums';
import { getConfig } from './config';
import { SignInRequest, WindowMessenger } from './messenger';

let windowMessenger: WindowMessenger;

async function renderPopup(src: string) {
  try {
    windowMessenger = await WindowMessenger.create(`${src}/signin`, 'width=600, height=800 screenX=400 screenY=100');
  } catch (error) {
    console.error('Error while creating window messenger', error);
    throw error;
  }
}

export async function getLoginOrRegistrationPayload(): Promise<WalletProxyResponse> {
  let payload: WalletProxyResponse;
  try {
    payload = await doGetLoginOrRegistrationPayload();
  } finally {
    windowMessenger.childWindow?.close();
    windowMessenger.dispose();
  }

  return payload;
}

async function doGetLoginOrRegistrationPayload(): Promise<WalletProxyResponse> {
  const { providerId, proxyUrl, frequencyRpcUrl, schemas, siwsOptions } = getConfig();

  const signInRequest: SignInRequest = {
    frequencyRpcUrl,
    providerId,
    requiredSchemas: schemas,
    siwsOptions,
  };

  await renderPopup(proxyUrl);
  windowMessenger.sendEvent('signinPayload', signInRequest);

  return new Promise((resolve, _reject) => {
    const checkPopupClosed = setInterval(function () {
      if (windowMessenger?.childWindow?.closed) {
        clearInterval(checkPopupClosed);
        return resolve({});
      }
    }, 500);

    windowMessenger.on(Message.WalletProxyResponseMessage, (data: WalletProxyResponseEvent) => {
      const response: WalletProxyResponse = data.detail;

      return resolve(response);
    });
  });
}
