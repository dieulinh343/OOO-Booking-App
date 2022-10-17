import { renderHook, act } from '@testing-library/react-hooks';
import useVersionChecking from '../useVersionChecking';


describe('hooks/useVersionChecking', () => {
  let props;

  const setup = () => {
    renderHook(() => useVersionChecking(props));
  };

  afterEach(() => {
    fetch.resetMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    props.handleNewVersionAvailable.mockReset();
  });

  beforeEach(() => {
    fetch.resetMocks();
    // Set default mock response to prevent pending timers from receiving invalid JSON
    fetch.mockResponse('{}');
    jest.useFakeTimers();
    props = {
      handleNewVersionAvailable: jest.fn(),
      config: {
        buildTimestamp: '123',
        versionCheckingInterval: 1000,
        versionCheckingEnabled: true,
        publicPath: 'public',
      },
    };
  });

  it('should not fetch if versionCheckingEnabled is false', () => {
    props = {
      ...props,
      config: {
        ...props.config,
        versionCheckingEnabled: false,
      },
    };
    setup();
    jest.advanceTimersByTime(3300);
    expect(fetch.mock.calls.length).toEqual(0);
  });

  it('should fetch one every interval passed', () => {
    setup();
    jest.advanceTimersByTime(3300);
    expect(fetch.mock.calls.length).toEqual(3);
  });

  it('should trigger handleNewVersionAvailable if buildTimeStamp is different', async () => {
    setup();
    fetch.once(JSON.stringify({
      buildTimeStamp: '500',
    }));
    await act(async () => {
      await jest.advanceTimersByTime(1100);
    });
    expect(props.handleNewVersionAvailable).toHaveBeenCalledTimes(1);
  });

  it('should not trigger handleNewVersionAvailable if buildTimeStamp is the same', async () => {
    setup();
    fetch.once(JSON.stringify({
      buildTimeStamp: 123,
    }));
    await act(async () => {
      await jest.advanceTimersByTime(1100);
    });
    expect(props.handleNewVersionAvailable).toHaveBeenCalledTimes(0);
  });

  it('should not trigger handleNewVersionAvailable if fetch failed', async () => {
    setup();
    fetch.mockResponse('Error code 400', { status: 400 });
    await act(async () => {
      await jest.advanceTimersByTime(1100);
    });
    expect(props.handleNewVersionAvailable).toHaveBeenCalledTimes(0);
  });
});
