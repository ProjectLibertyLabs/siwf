import { getConfig } from './config';
import { objectToQueryString } from '../misc_utils';

let childWindow: Window | undefined = undefined;

export const renderPopup = (src, params = {}) => {
  const queryString = objectToQueryString(params);
  const childURL = `${src}/signin?${queryString}`;
  const popup = window.open(childURL, '_blank', 'width=600, height=800 screenX=400 screenY=100');

  if (!popup) {
    throw new Error('Popup was blocked');
  }

  return popup;
};

export function signIn() {
  const { proxyUrl, rpc, schemas } = getConfig();

  const renderParams = {
    rpc,
    schemas: schemas,
  };
  const popupUrl = proxyUrl;

  childWindow = renderPopup(popupUrl, renderParams);
  const checkPopupClosed = setInterval(function () {
    if (childWindow && childWindow.closed) {
      clearInterval(checkPopupClosed);
    }
  }, 500);
}
