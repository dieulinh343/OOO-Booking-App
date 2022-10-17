import { mockWindowLocation, mockWindowLocationMethods, restoreWindowLocation } from '../testHelper';

describe('utils/testHelper', () => {
  afterEach(() => {
    restoreWindowLocation();
  });

  it('mockWindowLocation', () => {
    const oldLocation = JSON.parse(JSON.stringify(global.window.location));
    mockWindowLocation();
    expect(global.window.location).not.toEqual(oldLocation);
    window.location.href = '/123';
    expect(window.location.href).toBe('/123');
  });

  it('restoreWindowLocation', () => {
    const oldLocation = JSON.parse(JSON.stringify(global.window.location));
    mockWindowLocation();
    restoreWindowLocation();
    expect(global.window.location).toEqual(oldLocation);
  });

  it('mockWindowLocationMethods', () => {
    expect(() => window.location.reload()).toThrow();

    const oldLocation = global.window.location;
    mockWindowLocationMethods({
      reload: {
        value: () => mockWindowLocation('/new-path'),
      },
    });
    expect(() => window.location.reload()).not.toThrow();
    expect(window.location.pathname).toEqual('/new-path');

    restoreWindowLocation();
    expect(global.window.location).toEqual(oldLocation);
  });
});
