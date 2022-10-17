import Cookies from 'js-cookie';

export default class Storage {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  getStorageKey = (key: string): string => (`${this.prefix}.${key}`);

  getItem = (key: string): string | null => localStorage.getItem(this.getStorageKey(key));

  setItem = (key: string, value: string) => localStorage.setItem(this.getStorageKey(key), value);

  removeItem = (key: string) => localStorage.removeItem(this.getStorageKey(key));

  getJson = (key: string): any => {
    const value = this.getItem(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  setJson = (key: string, value: any) => this.setItem(key, JSON.stringify(value));

  setCookie = (key: string, value: string) => {
    Cookies.set(this.getStorageKey(key), value, { expires: 365, path: '/', secure: true });
  };

  getCookie = (key: string): string | undefined => Cookies.get(this.getStorageKey(key));

  removeCookie = (key: string) => {
    Cookies.remove(this.getStorageKey(key), { path: '/' });
  };

  getAllKeys = (): string[] => Object.keys(localStorage).filter(key => key.startsWith(this.prefix)).map(key => key.replace(`${this.prefix}.`, ''));
}
