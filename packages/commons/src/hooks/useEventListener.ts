import { useEffect, useRef } from 'react';

type EventListener<K extends keyof WindowEventMap> = (event: WindowEventMap[K]) => any;

export default function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: EventListener<K>, element: HTMLElement | Window = window) {
  // Create a ref that stores handler
  const savedHandler = useRef<EventListener<K> | null>(null);

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: WindowEventMap[K]) => savedHandler.current?.(event);

      // Add event listener
      // @ts-ignore
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      // eslint-disable-next-line consistent-return
      return () => {
        // @ts-ignore
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element], // Re-run if eventName or element changes
  );
}
