import Pusher from '../pusher';

jest.mock('../pusher');

describe('utils/pusher', () => {
  let pusherObject = null;
  let pusherInstance = null;
  const config_mock = {
    pusherChannelNamespace: 'sample-namespace',
    pusherKey: 'sample-app-key',
    apiUrl: 'http://sample-api.com',
  };
  const auth_mock = {
    getToken: () => '123',
  };

  beforeEach(async () => {
    pusherObject = new Pusher({}, config_mock, auth_mock);
    pusherObject.disconnect();
    pusherInstance = await pusherObject.connect();
  });

  it('connect pusher', () => {
    expect(pusherInstance).not.toBeNull();
  });

  it('subscribe, unsubscribe a channel and bind, unbind an event', () => {
    pusherObject.subscribe('account');
    expect(pusherInstance.channels[`account-${config_mock.pusherChannelNamespace}`]).toBeTruthy();
    pusherObject.bind('account', 'force_log_out', () => {});
    expect(pusherInstance.listeners.find(item => item.channelType === 'account' && item.eventName === 'force_log_out')).toBeTruthy();
    pusherObject.unbind('account', 'force_log_out');
    expect(pusherInstance.listeners.find(item => item.channelType === 'account' || item.eventName === 'force_log_out')).toBeFalsy();
    pusherObject.subscribe('public');
    expect(pusherInstance.channels[`public-${config_mock.pusherChannelNamespace}`]).toBeTruthy();
    pusherObject.unsubscribe('account');
    expect(pusherInstance.channels[`account-${config_mock.pusherChannelNamespace}`]).toBeFalsy();
  });

  it('bindWithCaseConverter', () => {
    const callback = jest.fn();
    pusherObject.bindWithCaseConverter({ a_b: 10 }, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith({ aB: 10 });
  });
});
