import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WindowEndpoint } from './window-endpoint';

describe('WindowEndpoint', () => {
  const messagePortMock = {
    postMessage: vi.fn(),
    start: vi.fn(),
    onmessage: vi.fn(),
  };

  const eventEmitterEmitMock = vi.spyOn(EventTarget.prototype, 'dispatchEvent');
  const eventEmitterOnMock = vi.spyOn(EventTarget.prototype, 'addEventListener');
  const eventEmitterOffMock = vi.spyOn(EventTarget.prototype, 'removeEventListener');

  beforeEach(() => {
    window.opener = {
      postMessage: vi.fn(),
    };

    window.removeEventListener = vi.fn();

    window.addEventListener = vi
      .fn()
      .mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
        listener({ data: 'handshake', ports: [messagePortMock] });
      });
  });

  describe('WindowEndpoint.create', () => {
    it('sends handshake message to the opener window', async () => {
      await WindowEndpoint.create();
      expect(window.opener.postMessage).toHaveBeenCalledWith('handshake', '*');
    });

    it('sets up the message channel when receiving handshake message', async () => {
      await WindowEndpoint.create();
      expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function), false);
      expect(messagePortMock.onmessage).toEqual(expect.any(Function));
      expect(messagePortMock.start).toHaveBeenCalled();
    });

    it('throws an error when handshake is not established', async () => {
      window.addEventListener = vi
        .fn()
        .mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
          listener({ data: 'handshake', ports: [] });
        });

      await expect(WindowEndpoint.create()).rejects.toThrow(Error);
    });

    it('removes an event listener', async () => {
      const endpoint = await WindowEndpoint.create();
      const eventName = 'testEvent';
      const listener = vi.fn();
      endpoint.off(eventName, listener);
      expect(eventEmitterOffMock).toHaveBeenCalledWith(eventName, expect.any(Function));
    });

    it('registers an event listener', async () => {
      const endpoint = await WindowEndpoint.create();
      const eventName = 'testEvent';
      const listener = vi.fn();
      endpoint.on(eventName, listener);
      expect(eventEmitterOnMock).toHaveBeenCalledWith(eventName, expect.any(Function), undefined);
    });

    it('emits an event when receiving a message through the message channel', async () => {
      await WindowEndpoint.create();
      const eventName = 'testEvent';
      const payload = { foo: 'bar' };
      const messageEvent = {
        data: {
          eventName,
          payload,
        },
      };
      messagePortMock.onmessage(messageEvent);
      const customEvent = new CustomEvent(eventName, { detail: payload });
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(customEvent);
    });
  });

  describe('sendEvent', () => {
    it('sends an event through the message channel', async () => {
      const windowEndpoint = await WindowEndpoint.create();
      const eventName = 'testEvent';
      const payload = { foo: 'bar' };
      windowEndpoint.sendEvent(eventName, payload);
      expect(messagePortMock.postMessage).toHaveBeenCalledWith({ eventName, payload });
    });
  });
});
