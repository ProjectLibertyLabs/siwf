import { getConfig } from './config';
import { WindowMessenger } from './messenger';
import { objectToQueryString } from '../misc_utils';

let childWindow: Window | undefined = undefined;

export const renderPopup = async (src, params = {}) => {
  const queryString = objectToQueryString(params);
  const childURL = `${src}/signin?${queryString}`;
  const messenger = await WindowMessenger.create(childURL, 'width=600, height=800 screenX=400 screenY=100');

  if (!messenger.childWindow) {
    throw new Error('Popup was blocked');
  }

  return messenger;
};

export async function signIn() {
  const { proxyUrl, rpc, schemas } = getConfig();

  const renderParams = {
    rpc,
    schemas: schemas,
  };
  const popupUrl = proxyUrl;

  childWindow = await renderPopup(popupUrl, renderParams);
  const checkPopupClosed = setInterval(function () {
    if (childWindow && childWindow.closed) {
      clearInterval(checkPopupClosed);
    }
  }, 500);
}
