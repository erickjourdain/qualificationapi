import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

const useDebounce = (callback: () => void) => {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 500);
  }, []);

  return debouncedCallback;
};

export default useDebounce;