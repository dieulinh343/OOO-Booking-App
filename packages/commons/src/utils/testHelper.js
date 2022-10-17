// Due to jest does not allow to change window.location.href,
// we use this function to apply a new location object
// * Reference: https://github.com/facebook/jest/issues/890

let oldLocation;

export const mockWindowLocation = (url = '/') => {
  // Deep copy old location object
  oldLocation = JSON.parse(JSON.stringify(global.window.location));
  // Apply new location object
  delete global.window.location;
  global.window.location = {};
  const parser = document.createElement('a');
  parser.href = url;
  ['href', 'protocol', 'host', 'hostname', 'origin', 'port', 'pathname', 'search', 'hash']
    .forEach((prop) => {
      Object.defineProperty(window.location, prop, {
        value: parser[prop],
        writable: true,
      });
    });
};

// Function to mock some of its methods while keeping the rest as original
// We do it by creating a new `window.location` object that's almost like the real `jsdom` `Location` object
// then override its methods by mockMethods argument
// * Reference: https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
export const mockWindowLocationMethods = (mockMethods = {}) => {
  // Deep copy old location object
  oldLocation = window.location;
  // Apply new location object
  delete window.location;
  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldLocation),
      ...mockMethods,
    },
  );
};

// Restore old location object in afterAll
export const restoreWindowLocation = () => {
  delete window.location;
  window.location = oldLocation;
};
