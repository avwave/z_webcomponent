import React, { useCallback, useEffect, useRef, useState } from "react";

const isFunction = (functionToCheck) => !!(
  typeof functionToCheck === 'function'
  && !!functionToCheck.constructor
  && !!functionToCheck.call
  && !!functionToCheck.apply
)


export const useInterval = ({ fn, delay, autoStart=true }) => {
  const timeout = useRef(null);
  const callback = useRef()

  const [isCleared, setIsCleared] = useState(false);
  const [start, setStart] = useState(autoStart);
  const [pause, setPause] = useState(!autoStart);

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
    if (typeof delay === 'number' && !pause) {
      
        timeout.current = setInterval(() => {
          callback?.current()
        }, delay)
      
    } else {
      clear()
    }
    return clear;
  }, [delay, pause]);

  const resume = useCallback(
    () => {
      
      setPause(!pause)
    },
    [pause],
  );

  return [isCleared, clear, resume]
}
