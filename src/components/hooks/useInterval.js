import React, { useCallback, useEffect, useRef, useState } from "react";

const isFunction = (functionToCheck) => !!(
  typeof functionToCheck === 'function'
  && !!functionToCheck.constructor
  && !!functionToCheck.call
  && !!functionToCheck.apply
)


export function useInterval(fn, delay) {
  const timeout = useRef(null);
  const callback = useRef()

  const [isCleared, setIsCleared] = useState(false);

  const clear = useCallback(
    () => {
      if (timeout.current) {
        setIsCleared(true)
        clearInterval(timeout.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (isFunction(fn)) {
      callback.current = fn
    }
  }, [fn]);

  useEffect(() => {
    if (typeof delay === 'number') {
      timeout.current = setInterval(() => {
        callback?.current()
      }, delay)
    }
    return clear;
  }, [delay]);

  return [isCleared, clear]
}
