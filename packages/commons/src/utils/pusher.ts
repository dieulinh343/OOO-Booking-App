import PusherLib from 'pusher-js';
import type PusherType from 'pusher-js';
import type { Channel } from 'pusher-js';
import caseConverter from './caseConverter';

export interface PusherConfig {
  pusherKey: string
  apiUrl: string
  pusherChannelNamespace: string,
  pusherCluster?: string
}

export interface AuthUtils {
  getToken: () => string | null
}

declare global {
  interface Window {
    mockPusher: any
    MockPusher: any
    mockPusher1: any
  }
}

export default class Pusher {
  pusher: PusherType | null = null;

  channels: Record<string, Channel> = {};

  config: PusherConfig;

  authUtils: AuthUtils;

  constructor(predefinedChannels = {}, config: PusherConfig, authUtils: AuthUtils) {
    this.pusher = null;
    this.channels = predefinedChannels;
    this.config = config;
    this.authUtils = authUtils;
  }

  defaultConnect = async (authEndpoint: string, options = { log: true }) => {
    // Set to true if want to log all Pusher state changes.
    PusherLib.logToConsole = !!options.log;
    const accessToken = this.authUtils.getToken();
    this.pusher = new PusherLib(this.config.pusherKey, {
      authEndpoint,
      cluster: this.config.pusherCluster,
      auth: {
        params: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  connect = async (log = true) => {
    if (window.MockPusher) {
      this.pusher = new window.MockPusher(this.channels, this.config, this.authUtils);
      window.mockPusher ? window.mockPusher1 = this.pusher : window.mockPusher = this.pusher;
    } else {
      await this.defaultConnect(`${this.config.apiUrl}/pusher/auth`, {
        log,
      });
    }

    return this.pusher;
  }

  subscribe = (channelType: string) => {
    let channelName = `${channelType}`;
    channelName += `-${this.config.pusherChannelNamespace}`;

    if (this.pusher) {
      this.channels[channelType] = this.pusher.subscribe(channelName);
    }
  };

  unsubscribe = (channelType: string) => {
    const channel = this.channels[channelType];
    if (this.channels[channelType] !== undefined) {
      channel.unbind(); // Remove all handlers on channel

      if (this.pusher) {
        this.pusher.unsubscribe(channel.name);
        delete this.channels[channelType];
      }
    }
  };

  bindWithCaseConverter = (state: any, callback: (state: any) => void) => {
    const newState = caseConverter.snakeCaseToCamelCase(state);
    callback(newState);
  };

  bind = (channelType: string, eventName: string, callback: (state: any) => void) => {
    const channel = this.channels[channelType];
    channel
      ? channel.bind(eventName, (state: any) => {
        this.bindWithCaseConverter(state, callback);
      })
      : console.log('No channel with type', channelType);
  };

  unbind = (channelType: string, eventName: string) => {
    const channel = this.channels[channelType];
    channel !== undefined && channel.unbind(eventName);
  };

  disconnect = () => {
    if (this.pusher) {
      Object.keys(this.channels).forEach((channelType) => {
        this.unsubscribe(channelType);
      });
      this.pusher.disconnect();
      this.pusher = null;
    }
  };

  bindStateChangeEvent = (func: (states: {current: string}) => void) => {
    if (this.pusher) { this.pusher.connection.bind('state_change', func); }
  };

  unbindStateChangeEvent = () => {
    if (this.pusher) { this.pusher.connection.unbind('state_change'); }
  };

   bindConnectedEvent = (func: () => void) => {
     if (this.pusher) { this.pusher.connection.bind('connected', func); }
   };

   unBindConnectedEvent = (func: () => void) => {
     if (this.pusher) { this.pusher.connection.bind('connected', func); }
   };

   sendClientEvent = (channelType: string, event: string, data: any) => {
     const channel = this.channels[channelType];
     if (this.pusher) {
       channel.trigger(`client-${event}`, data);
     }
   };
}
