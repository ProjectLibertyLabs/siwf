import { ErrorMessage, Message } from './enums';

export class WindowMessenger {
  private channel: MessageChannel;
  private eventTarget: EventTarget;
  private handshakeComplete: boolean = false;
  public childWindow: Window | null;

  private constructor() {}

  public static async create(url: string, windowFeatures?: string): Promise<WindowMessenger> {
    const windowMessenger = new WindowMessenger();
    await windowMessenger.initialize(url, windowFeatures);

    return windowMessenger;
  }

  private async initialize(url: string, windowFeatures?: string) {
    this.channel = new MessageChannel();
    this.eventTarget = new EventTarget();
    this.childWindow = window.open(url, '_blank', windowFeatures);

    if (this.childWindow) {
      await this.setupChannel(url);
    } else {
      throw new Error(ErrorMessage.FailedToOpenWindow);
    }
  }

  private setupChannel(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (!this.handshakeComplete) {
          window.removeEventListener('message', handleMessageEvent);
          reject(new Error(ErrorMessage.FailedToEstablishHandshake));
        }
      }, 3000);

      const handleMessageEvent = (event: MessageEvent) => {
        if (event.origin === new URL(url).origin && event.data === Message.Handshake) {
          clearTimeout(timeout);
          this.childWindow!.postMessage(Message.Handshake, event.origin, [this.channel.port2]);
          this.channel.port1.onmessage = (event: MessageEvent) => {
            this.eventTarget.dispatchEvent(new CustomEvent(event.data.eventName, { detail: event.data.payload }));
          };
          this.channel.port1.start();

          window.removeEventListener('message', handleMessageEvent);
          console.log('handshake complete');
          this.handshakeComplete = true;
          resolve();
        }
      };

      window.addEventListener('message', handleMessageEvent);
    });
  }

  public sendEvent(eventName: string, payload: unknown) {
    this.channel.port1.postMessage({ eventName, payload });
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
    this.channel.port1.close();
  }
}
