import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WindowMessenger } from './window-messenger';

describe('WindowMessenger', () => {
  let windowMessenger: WindowMessenger;
  const windowPostMessage = vi.fn();
  const messageChannelPort1Mock = {
    postMessage: vi.fn(),
    start: vi.fn(),
    onmessage: vi.fn(),
  };
  const messageChannelPort2Mock = {
    postMessage: vi.fn(),
    start: vi.fn(),
    onmessage: vi.fn(),
  };

  const eventEmitterEmitMock = vi.spyOn(EventTarget.prototype, 'dispatchEvent');
  const eventEmitterOnMock = vi.spyOn(EventTarget.prototype, 'addEventListener');
  const eventEmitterOffMock = vi.spyOn(EventTarget.prototype, 'removeEventListener');

  vi.stubGlobal('MessageChannel', function () {
    this.port1 = messageChannelPort1Mock;
    this.port2 = messageChannelPort2Mock;
  });

  beforeEach(async () => {
    window.open = vi.fn().mockReturnValue({ postMessage: windowPostMessage });
    window.addEventListener = vi
      .fn()
      .mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
        listener({ origin: 'http://example.com', data: 'handshake' });
      });

    windowMessenger = await WindowMessenger.create('http://example.com');
  });

  it('opens a child window with the provided URL', () => {
    expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank', undefined);
  });

  it('sets up the message channel when the child window is available', () => {
    expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('sends handshake message and sets up event listener when receiving handshake message', () => {
    const event = {
      origin: 'http://example.com',
      data: 'handshake',
    };

    expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    expect(windowPostMessage).toHaveBeenCalledWith('handshake', event.origin, [messageChannelPort2Mock]);
    expect(messageChannelPort1Mock.onmessage).toEqual(expect.any(Function));
    expect(messageChannelPort1Mock.start).toHaveBeenCalled();
  });

  it('sends an event through the message channel', () => {
    const eventName = 'testEvent';
    const payload = { foo: 'bar' };
    windowMessenger.sendEvent(eventName, payload);
    expect(messageChannelPort1Mock.postMessage).toHaveBeenCalledWith({ eventName, payload });
  });

  it('registers an event listener', () => {
    const eventName = 'testEvent';
    const listener = vi.fn();
    windowMessenger.on(eventName, listener);
    expect(eventEmitterOnMock).toHaveBeenCalledWith(eventName, expect.any(Function), undefined);
  });

  it('unregisters an event listener', () => {
    const eventName = 'testEvent';
    const listener = vi.fn();
    windowMessenger.off(eventName, listener);
    expect(eventEmitterOffMock).toHaveBeenCalledWith(eventName, expect.any(Function));
  });

  it('throws an error when handshake is not established', async () => {
    window.addEventListener = vi
      .fn()
      .mockImplementation((event: string, listener: EventListenerOrEventListenerObject) => {
        listener({ data: 'nohandshake' });
      });

    await expect(WindowMessenger.create('http://example.com')).rejects.toThrow(Error);
  });
});
