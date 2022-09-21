import React, { useCallback, useMemo, useRef, useState } from "react";
import qs from "query-string";

export function useUrlState({ queryKey, defaultValue, disable = false }) {
  const [state, setState] = useState(defaultValue);
  const ref = useRef(state);

  const setQueryString = useCallback((qsValue) => {
    const newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      qsValue;
    if (!disable) {
      window.history.pushState({ path: newurl }, "", newurl);
    }
  }, [disable]);

  const getQueryStringValue = useMemo(() => {
    const values = qs.parse(window.location.search);
    const pValue = values[queryKey] || state || null
    if (pValue) {
      try {
        ref.current = JSON.parse(pValue);
      } catch (error) {
        ref.current = pValue;
      }
    }
    return ref.current;
  }, [queryKey, state]);

  const dispatchFromUrl = useCallback(
    function (val) {
      const returnValue = typeof val === "function" ? val(ref.current) : val;
      const parsedValue = typeof returnValue === "object" ? JSON.stringify(returnValue) : returnValue;

      const values = qs.parse(window.location.search);
      const mergedValues = {
        ...values,
        [queryKey]: parsedValue
      }
      const newQsValue = qs.stringify(mergedValues);
      setQueryString(`?${newQsValue}`);
      setState(returnValue);
    },
    [queryKey, setQueryString]
  );

  const dispatch = useCallback(function (val) {
    ref.current = typeof val === "function" ?
      val(ref.current) : val
    setState(ref.current)
  }, []);

  if (disable) {
    return [state, dispatch, ref]
  } else {
    return [getQueryStringValue, dispatchFromUrl, ref];
  }
}
