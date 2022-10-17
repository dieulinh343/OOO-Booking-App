import jwtDecode from 'jwt-decode';

interface AuthStorage {
  setCookie(key: string, value: string): void;
  getStorageKey(key: string): string;
  getJson(key: string): any;
  setJson(key: string, value: any): void;
  removeItem(key: string): void;
  removeCookie(key: string): void;
}

interface DecodedAccessToken {
  exp: number;
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
}

type AnyFunction = (...args: any) => any;

export default class Auth {
  storage: AuthStorage;

  authKey: string;

  data: AuthData | null = null;

  logOutListeners: AnyFunction[];

  onChangedListeners: AnyFunction[];

  onTokenNearlyExpiredListeners: AnyFunction[];

  tokenNearlyExpiredNotifierInterval?: number;

  constructor(storage: AuthStorage, authKey = 'authentication') {
    this.storage = storage;
    this.authKey = authKey;
    this.setData(this.storage.getJson(this.authKey));
    if (this.data) {
      this.storage.setCookie('Authorization', `Bearer ${this.data.accessToken}`);
    }
    this.logOutListeners = [];
    this.onChangedListeners = [];
    this.onTokenNearlyExpiredListeners = [];

    window.addEventListener('storage', (e) => {
      if (this.storage.getStorageKey(this.authKey) === e.key) {
        // Sync new auth data
        const data = e.newValue ? JSON.parse(e.newValue) : null;

        if (data) {
          this.setAuth(data);
        }
      }

      if (
        this.storage.getStorageKey(this.authKey) === e.key
        && !!e.oldValue
        && !e.newValue
        && this.logOutListeners.length > 0
      ) {
        this.logOutListeners.forEach((callback) => {
          if (typeof callback === 'function') {
            callback(e);
          }
        });
      }
    });
  }

  setData(data: AuthData | null) {
    this.data = data;

    if (this.tokenNearlyExpiredNotifierInterval) {
      clearInterval(this.tokenNearlyExpiredNotifierInterval);
    }

    if (data?.accessToken) {
      try {
        const { exp } = jwtDecode<DecodedAccessToken>(data.accessToken);

        const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

        const threshold = randomIntFromInterval(5000, 30000);

        this.tokenNearlyExpiredNotifierInterval = window.setInterval(() => {
          const duration = exp * 1000 - Date.now() - threshold;

          if (duration < 0) {
            clearInterval(this.tokenNearlyExpiredNotifierInterval);
            this.onTokenNearlyExpiredListeners.forEach(callback => callback());
          }
        }, 1000);
      } catch (e) {
        console.error(e);
      }
    }
  }

  isAuth() {
    return !!(this.getToken());
  }

  getToken() {
    return this.data?.accessToken;
  }

  getRefreshToken() {
    return this.data?.refreshToken;
  }

  setAuth(data: AuthData) {
    this.setData(data);
    this.storage.setJson(this.authKey, data);
    this.storage.setCookie('Authorization', `Bearer ${this.data!.accessToken}`);
    this.onChangedListeners.forEach((callback) => {
      callback(data);
    });
  }

  logout() {
    this.setData(null);
    this.storage.removeItem(this.authKey);
    this.storage.removeCookie('userId');
    this.storage.removeCookie('Authorization');
  }

  addLogOutListener = (callback: AnyFunction) => {
    this.logOutListeners = [
      ...this.logOutListeners,
      callback,
    ];
  }

  removeLogOutListener = (callback: AnyFunction) => {
    this.logOutListeners = this.logOutListeners.filter(item => item !== callback);
  }

  removeAllLogOutListener() {
    this.logOutListeners = [];
  }

  addOnChangedListener = (callback: AnyFunction) => {
    this.onChangedListeners = [
      ...this.onChangedListeners,
      callback,
    ];
  }

  removeOnChangedListener = (callback: AnyFunction) => {
    this.onChangedListeners = this.onChangedListeners.filter(item => item !== callback);
  }

  setOnTokenNearlyExpiredListener = (callback: AnyFunction) => {
    this.onTokenNearlyExpiredListeners = [
      ...this.onTokenNearlyExpiredListeners,
      callback,
    ];
  }

  removeOnTokenNearlyExpiredListener = (callback: AnyFunction) => {
    this.onTokenNearlyExpiredListeners = this.onTokenNearlyExpiredListeners.filter(item => item !== callback);
  }
}
