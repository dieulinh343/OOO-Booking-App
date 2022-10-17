import Cookies from 'js-cookie';
import Storage from '../storage';

jest.mock('js-cookie');

describe('utils/storage', () => {
  let storageObject = null;
  const SAMPLE_PREFIX = 'sp';

  beforeEach(() => {
    Cookies.set.mockClear();
    Cookies.remove.mockClear();
    storageObject = new Storage(SAMPLE_PREFIX);
  });

  afterEach(() => {
    storageObject = null;
  });

  it('should be able to execute constructor successfully', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject).toBeTruthy();
  });

  it('should be able to get storage key successfully', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject.getStorageKey('product')).toEqual(`${SAMPLE_PREFIX}.product`);
  });

  it('should be able to set, get, and delete item successfully', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject.getItem('product')).toBeFalsy();
    storageObject.setItem('product', 'a1');
    expect(storageObject.getItem('product')).toEqual('a1');
    storageObject.removeItem('product');
    expect(storageObject.getItem('product')).toBeFalsy();
  });

  it('should be able to setJson and getJson successfully', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject.getItem('productInJson')).toBeFalsy();
    storageObject.setJson('productInJson', { value: 'a1' });
    expect(storageObject.getJson('productInJson')).toEqual({ value: 'a1' });
    storageObject.removeItem('productInJson');
    expect(storageObject.getItem('productInJson')).toBeFalsy();
  });

  it('should be able to return non-JSON value when calling getJson', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject.getItem('product')).toBeFalsy();
    storageObject.setItem('product', 'a1');
    expect(storageObject.getJson('product')).toEqual('a1');
  });

  it('should be able to set, get, and delete cookie successfully', () => {
    storageObject = new Storage(SAMPLE_PREFIX);
    expect(storageObject.getCookie('product-cookie')).toBeFalsy();
    storageObject.setCookie('product-cookie', 'chocolate cookies');
    expect(Cookies.set).toHaveBeenCalledWith('sp.product-cookie', 'chocolate cookies', {
      expires: 365,
      path: '/',
      secure: true });
    expect(storageObject.getCookie('sp.product-cookie'));
    expect(Cookies.get).toHaveBeenCalledWith('sp.product-cookie');
    storageObject.removeCookie('product-cookie');
    expect(Cookies.remove).toHaveBeenCalledWith('sp.product-cookie', { path: '/' });
    expect(storageObject.getCookie('product-cookie')).toBeFalsy();
  });
});
