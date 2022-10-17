import { useRef, useCallback } from 'react';

/**
 * Store both the latest and an old versions of a value, so you can use the old value and update it later intentionally. Only use refs so the update operation won't trigger re-render.
 *
 * @param {any} value - The latest value to store.
 * @param {boolean} [initLazyValue=true] - If true, the lazy value will init with the first value passed.
 *
 * @typedef {Object} ReturnValue
 * @property {any} lazy - The old value.
 * @property {any} latest - The latest value that passed to the hook.
 * @property {function(): void} update - Call to sync up the old value with the latest value.
 * @property {function(any): void} forceUpdate - Call to force update both old and latest values to a given one. But the next time a new value is passed via props, the latest value will be updated.
 * @returns {ReturnValue} lazy, latest, update(), forceUpdate(value)
 */
export default function useLazyUpdate <T>(
  value: T,
  initLazyValue = true,
): {
  lazy: T | undefined,
  latest: T,
  update: () => void,
  forceUpdate: (value: T) => void,
} {
  const lazyRef = useRef<T | undefined>(initLazyValue ? value : undefined);
  const latestRef = useRef<T>(value);

  latestRef.current = value;

  // TODO: use forceRerender if we need to trigger re-render on update. Should be configurable via param.
  const update = useCallback(() => {
    lazyRef.current = latestRef.current;
  }, []);

  const forceUpdate = useCallback((forceUpdateValue) => {
    latestRef.current = forceUpdateValue;
    lazyRef.current = forceUpdateValue;
  }, []);

  return {
    lazy: lazyRef.current,
    latest: latestRef.current,
    update,
    forceUpdate,
  };
}
