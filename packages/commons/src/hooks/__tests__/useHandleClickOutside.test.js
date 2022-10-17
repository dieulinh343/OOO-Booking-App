import { renderHook } from '@testing-library/react-hooks';
import { unmountComponentAtNode } from 'react-dom';
import useHandleClickOutside from '../useHandleClickOutside';

describe('hooks/useHandleClickOutside', () => {
  let callback;
  let container;
  let outsiderContainer;
  let containerRef;

  const triggerMouseEvent = (node, eventType) => {
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
  };

  beforeEach(() => {
    callback = jest.fn();
    container = document.createElement('div');
    document.body.appendChild(container);
    outsiderContainer = document.createElement('div');
    document.body.appendChild(outsiderContainer);
    containerRef = {
      current: container,
    };
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    unmountComponentAtNode(outsiderContainer);
    outsiderContainer.remove();
    outsiderContainer = null;
    containerRef = undefined;
  });

  it('passing in list of components, should not trigger callback if click inside', () => {
    renderHook(
      () => useHandleClickOutside([containerRef, outsiderContainer], callback),
    );
    triggerMouseEvent(container, 'mousedown');
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('passing in a component object, should not trigger callback if click inside', () => {
    renderHook(
      () => useHandleClickOutside(containerRef, callback),
    );
    triggerMouseEvent(container, 'mousedown');
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('passing in list of components, should trigger callback if click outside', () => {
    renderHook(
      () => useHandleClickOutside([containerRef], callback),
    );
    triggerMouseEvent(outsiderContainer, 'mousedown');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('passing in a component object, should trigger callback if click outside', () => {
    renderHook(
      () => useHandleClickOutside(containerRef, callback),
    );
    triggerMouseEvent(outsiderContainer, 'mousedown');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger callback when hook is unmounted', () => {
    const { unmount } = renderHook(
      () => useHandleClickOutside([containerRef], callback),
    );
    unmount();
    triggerMouseEvent(outsiderContainer, 'mousedown');
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
