/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, RefObject } from 'react';

export default (refs: RefObject<HTMLDivElement | undefined> | RefObject<HTMLDivElement | undefined>[], onClick: (event: Event) => void) => {
  // If ref.current is not present, then we can assume that it is always outside

  const isNode = (target: EventTarget): target is Node => (target as Node).nodeType !== undefined;

  const isOutside = (event: Event, ref: RefObject<HTMLDivElement | undefined>) => {
    if (!event.target) {
      return false;
    }

    if (isNode(event.target)) {
      return ref.current ? !ref.current.contains(event.target) : true;
    }

    return false;
  };

  const handleClickOutside = useCallback((event) => {
    if (Array.isArray(refs)) {
      // If pass multiple refs, check if none of them are clicked
      let shouldNotCallOnClick = false;
      refs.forEach((ref) => {
        if (!isOutside(event, ref)) {
          shouldNotCallOnClick = true;
        }
      });
      if (!shouldNotCallOnClick) {
        onClick(event);
      }
    } else if (isOutside(event, refs)) {
      // Or one ref
      onClick(event);
    }
  }, [onClick]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
};
