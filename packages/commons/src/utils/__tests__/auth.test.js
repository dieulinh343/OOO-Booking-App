import jwt from 'jsonwebtoken';
import Auth from '../auth';
import Storage from '../storage';

jest.useFakeTimers();

describe('utils/auth', () => {
  const SAMPLE_PREFIX = 'sp';
  let storageObject = null;
  let authObject = null;
  let callBackSampleA = null;
  let callBackSampleB = null;
  let accessToken;
  const variableC = null;

  beforeEach(() => {
    storageObject = new Storage(SAMPLE_PREFIX);
    authObject = new Auth(storageObject, 'authentication', {
      checkInterval: 60 * 1000,
    });
    callBackSampleA = jest.fn();
    callBackSampleB = jest.fn();

    accessToken = jwt.sign({ foo: 'bar' }, 'shhhh', {
      expiresIn: '1m',
    });
  });

  afterEach(() => {
    storageObject = null;
    authObject = null;
  });

  it('should initiate object successfully', () => {
    expect(authObject).toBeTruthy();
  });

  it('should be able to setAuth, getToken, getRefreshToken and access if the client is auth correctly', () => {
    expect(authObject.getToken()).toBeUndefined();
    expect(authObject.isAuth()).toBe(false);
    authObject.setAuth({
      accessToken,
      refreshToken: 456,
    });
    expect(authObject.getToken()).toEqual(accessToken);
    expect(authObject.getRefreshToken()).toEqual(456);
    expect(authObject.isAuth()).toBe(true);
  });

  it('should be able to log out successfully', () => {
    authObject.setAuth({
      accessToken,
    });
    authObject.logout();
    expect(authObject.getToken()).toBeUndefined();
    expect(authObject.getRefreshToken()).toBeUndefined();
    expect(authObject.isAuth()).toBeFalsy();
  });

  it('should be able to add and remove log out listener successfully', () => {
    authObject.setAuth({
      accessToken,
    });
    authObject.addLogOutListener(callBackSampleA);
    // mock storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: undefined,
      oldValue: accessToken,
    }));
    expect(callBackSampleA).toBeCalledTimes(1);
    authObject.removeLogOutListener(callBackSampleA);
    authObject.setAuth({
      accessToken,
    });
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: undefined,
      oldValue: accessToken,
    }));
    expect(callBackSampleA).toBeCalledTimes(1);
  });

  it('should be able remove all log out listeners successfully', () => {
    authObject.setAuth({
      accessToken,
    });
    authObject.addLogOutListener(callBackSampleA);
    authObject.addLogOutListener(callBackSampleB);
    authObject.addLogOutListener(variableC);
    // mock storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: undefined,
      oldValue: accessToken,
    }));
    expect(callBackSampleA).toBeCalledTimes(1);
    expect(callBackSampleB).toBeCalledTimes(1);
    authObject.removeAllLogOutListener();
    authObject.setAuth({
      accessToken,
    });
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: undefined,
      oldValue: accessToken,
    }));
    expect(callBackSampleA).toBeCalledTimes(1);
    expect(callBackSampleB).toBeCalledTimes(1);
  });

  it('should handle token nearly expired correctly', () => {
    const listener = jest.fn();
    const now = Date.now();
    const oldDateNow = Date.now;
    authObject.setAuth({
      accessToken,
    });
    authObject.setOnTokenNearlyExpiredListener(listener);

    Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now + 1 * 60 * 1000);
    jest.runOnlyPendingTimers(); // 1m later

    expect(listener).toBeCalledTimes(1);

    Date.now = oldDateNow;
  });

  it('should update its auth data when auth data on local storage changes', () => {
    authObject.setAuth({
      accessToken,
    });

    const newAccessToken = jwt.sign({ foo: 'bar2' }, 'shhhh', {
      expiresIn: '1m',
    });

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: `{"accessToken": "${newAccessToken}"}`,
    }));

    expect(authObject.data.accessToken).toEqual(newAccessToken);
  });

  it('should not set its auth data to null when auth data on local storage changes to null', () => {
    // We don't want to automatically logout when user logs out on other tab

    authObject.setAuth({
      accessToken,
    });

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sp.authentication',
      newValue: null,
    }));

    expect(authObject.data.accessToken).toEqual(accessToken);
  });
});
