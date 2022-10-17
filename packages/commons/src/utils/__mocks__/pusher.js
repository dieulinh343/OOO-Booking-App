import caseConverter from '../caseConverter';

export default class Pusher {
  constructor(predefinedChannels = {}, config, authUtils) {
    this.authUtils = authUtils;
    this.config = config;
    this.channels = predefinedChannels;
    this.listeners = [];
    this.sendClientEvent = jest.fn();
    this.onConnected = jest.fn();
  }

  connect = jest.fn(async () => (this));

  subscribe = jest.fn((channelType) => {
    let channelName = `${channelType}`;
    channelName += `-${this.config.pusherChannelNamespace}`;
    this.channels[channelName] = true;
  })

  unsubscribe = jest.fn((channelType) => {
    let channelName = `${channelType}`;
    channelName += `-${this.config.pusherChannelNamespace}`;
    this.channels[channelName] = undefined;
  })

  bind = jest.fn((channelType, eventName, callback) => {
    this.listeners.filter(listener => listener.channelType !== channelType || listener.eventName !== eventName);
    this.listeners.push({
      channelType,
      eventName,
      callback,
    });
  });

  unbind = jest.fn((channelType, eventName) => {
    this.listeners = this.listeners.filter(listener => listener.channelType !== channelType && listener.eventName !== eventName);
  });

  unbindAll = jest.fn(() => {
    this.listeners = [];
  });

  disconnect = jest.fn();

  fire = jest.fn((channelType, eventName, data) => {
    this.listeners.filter(listener => listener.channelType === channelType && listener.eventName === eventName)
      .forEach((listener) => {
        listener.callback(data);
      });
  });

  bindWithCaseConverter = jest.fn((string, callback) => {
    callback(caseConverter.snakeCaseToCamelCase(string));
  });
}
