import { Message } from './enums.js';
import { ErrorMessage } from './enums.js';

export class WindowEndpoint {
  private _messagePort?: MessagePort;
  private eventTarget: EventTarget = new EventTarget();

  private constructor() {}

  public static async create(): Promise<WindowEndpoint> {
    const endpoint = new WindowEndpoint();
    await endpoint.initialize();
    return endpoint;
  }

  private async initialize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (!this._messagePort) {
          window.removeEventListener('message', handleMessageEvent);
          reject(new Error(ErrorMessage.FailedToEstablishHandshake));
        }
      }, 3000);

      const handleMessageEvent = (event: MessageEvent) => {
        if (event.data === Message.Handshake && event.ports[0]) {
          clearTimeout(timeout);
          this.messagePort = event.ports[0];
          this.setupMessageChannel();
          window.removeEventListener('message', handleMessageEvent);
          resolve();
        }
      };

      window.addEventListener('message', handleMessageEvent, false);
      window.opener.postMessage(Message.Handshake, '*');
    });
  }

  private setupMessageChannel() {
    this.messagePort.onmessage = (event: MessageEvent) => {
      this.eventTarget.dispatchEvent(new CustomEvent(event.data.eventName, { detail: event.data.payload }));
    };

    this.messagePort.start();
  }

  private set messagePort(messagePort: MessagePort) {
    this._messagePort = messagePort;
  }

  private get messagePort(): MessagePort {
    if (!this._messagePort) {
      throw new Error(ErrorMessage.MessagePortNotSet);
    }

    return this._messagePort;
  }

  public sendEvent(eventName: string, payload: unknown) {
    this.messagePort.postMessage({ eventName, payload });
  }

  public on<T extends Record<string, unknown>>(
    eventName: string,
    listener: (event: CustomEvent<T>) => void,
    options?: boolean | AddEventListenerOptions
  ) {
    const eventListener: EventListener = (event: Event) => {
      listener(event as CustomEvent<T>);
    };
    this.eventTarget.addEventListener(eventName, eventListener, options);
  }

  public off<T extends Record<string, unknown>>(eventName: string, listener: (event: CustomEvent<T>) => void) {
    const eventListener: EventListener = (event: Event) => {
      listener(event as CustomEvent<T>);
    };
    this.eventTarget.removeEventListener(eventName, eventListener);
  }

  public dispose() {
    this.messagePort.close();
  }
}
