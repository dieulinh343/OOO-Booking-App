const { configure } = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const $ = require('jquery');
const timezoneMock = require('timezone-mock');

// Setup enzyme
configure({ adapter: new Adapter() });

window.scrollTo = jest.fn();
window.open = jest.fn();
window.alert = jest.fn();

// fetch
global.fetch = require('jest-fetch-mock');

window.$ = window.jQuery = $;

window.flushPromises = () => new Promise((resolve) => {
  setImmediate(resolve);
});

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener() {},
    removeListener() {},
  };
};

timezoneMock.register('UTC');
