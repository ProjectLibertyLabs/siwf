import { getConfig } from './config';
import { SignInRequest, WindowMessenger } from './messenger';

export async function renderPopup(src: string) {
  const messenger = await WindowMessenger.create(`${src}/signin`, 'width=600, height=800 screenX=400 screenY=100');

  if (!messenger.childWindow) {
    throw new Error('Popup was blocked');
  }

  return messenger;
}

export async function signIn() {
  const { proxyUrl, schemas } = getConfig();

  const signInRequest: SignInRequest = {
    providerId: '1',
    requiredSchemas: schemas,
  };
  const popupUrl = proxyUrl;

  const messenger: WindowMessenger = await renderPopup(popupUrl);
  messenger.sendEvent('signinPayload', signInRequest);
  const checkPopupClosed = setInterval(function () {
    if (messenger.childWindow && messenger.childWindow.closed) {
      clearInterval(checkPopupClosed);
    }
  }, 500);
}
