export enum Message {
  Handshake = 'handshake',
}

export enum ErrorMessage {
  FailedToOpenWindow = 'Failed to open window',
  MessagePortNotSet = 'MessagePort is not set.',
  FailedToEstablishHandshake = 'Failed to establish handshake with the window.',
}
