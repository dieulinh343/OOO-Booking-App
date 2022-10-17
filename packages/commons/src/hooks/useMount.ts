import { useRef, useEffect } from 'react';

function useMount() {
  const mounted = useRef<boolean>(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });
  return mounted;
}

export default useMount;
