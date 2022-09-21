import React, { useCallback, useMemo, useRef, useState } from "react";
import * as qs from "query-string";
import moment from "moment";

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
    let convertedValue = pValue;
    if (pValue) {
      try {
        convertedValue = JSON.parse(pValue);
        try {
          const isDate = moment(new Date(convertedValue)).isValid();
          convertedValue = isDate ? moment(convertedValue).toDate() : convertedValue;
        }catch (dateparseError) {
        }
      } catch (error) {
        convertedValue = pValue;
      }
      ref.current = convertedValue;
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
