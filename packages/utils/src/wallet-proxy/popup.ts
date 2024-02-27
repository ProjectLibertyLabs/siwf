import { objectToQueryString } from '../misc_utils';
import { Config } from './config';
import { SignInRequest, WindowMessenger } from './messenger';

export async function renderPopup(src: string, frequencyRpcUrl: string) {
  const messenger = await WindowMessenger.create(
    `${src}/signin?${objectToQueryString({ frequencyRpcUrl })}`,
    'width=600, height=800 screenX=400 screenY=100'
  );

  if (!messenger.childWindow) {
    throw new Error('Popup was blocked');
  }

  return messenger;
}

export async function signIn(providerId: string, config: Config) {
  const { proxyUrl, frequencyRpcUrl, schemas } = config;

  const signInRequest: SignInRequest = {
    providerId,
    requiredSchemas: schemas,
  };
  const popupUrl = proxyUrl;

  const messenger: WindowMessenger = await renderPopup(popupUrl, frequencyRpcUrl);
  messenger.sendEvent('signinPayload', signInRequest);
  const checkPopupClosed = setInterval(function () {
    if (messenger.childWindow && messenger.childWindow.closed) {
      clearInterval(checkPopupClosed);
    }
  }, 500);
}
