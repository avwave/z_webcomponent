import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _JSONUrl from "json-url";
import moment from "moment";

export function useUrlState({ queryKey, defaultValue, disable = false }) {
  const JSONUrl = _JSONUrl('lzma');
  const [state, setState] = useState(defaultValue);
  const ref = useRef(state);
  const [url, setUrl] = useState('');
  const [qsValue, setQsValue] = useState();

  const setQueryString = useCallback((qsValue) => {
    const newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      qsValue;
    setUrl(newurl)
    if (!disable) {
      window?.history?.replaceState({ path: newurl }, "", newurl);
    }
  }, [disable]);

  const getQueryStringValue = useCallback(
    async () => {
    const qs = new URLSearchParams(window.location.search);
    const pValue = qs.get(queryKey) || state || null
    // const uncrush = JSONCrush.uncrush(decodeURIComponent(window.location.search))?.substring(1);
    
    let convertedValue = '';
    let getParam = ''
    if (pValue) {
      try {
        const uncrush = await JSONUrl.decompress(pValue)
        getParam = uncrush ? JSON.parse(uncrush) : {};    
        convertedValue = JSON.parse(getParam);
        const calltype = Object.prototype.toString.call(convertedValue)
        if (calltype === '[object String]') {
          try {
            const isDate = moment(new Date(convertedValue)).isValid();
            convertedValue = isDate ? moment(convertedValue).toDate() : convertedValue;
          } catch (dateparseError) {
          }
        }
      } catch (error) {
        convertedValue = getParam;
      }
      ref.current = convertedValue;
    }
    setQsValue(convertedValue);
  }, [JSONUrl, queryKey, state]);
  
  useEffect(
    () => {
      getQueryStringValue()
    }, [window?.location?.search]
  );

  const dispatchFromUrl = useCallback(
    async function (val) {
      const returnValue = typeof val === "function" ? val(ref.current) : val;
      const parsedValue = typeof returnValue === "object" ? JSON.stringify(returnValue) : returnValue;
      const crushValue = await JSONUrl.compress(JSON.stringify(parsedValue));

      const qs = new URLSearchParams(window.location.search);
      let values = {};
      for (var value of qs.keys()) {
        values[value] = qs.get(value);
      }
      const mergedValues = {
        ...values,
        [queryKey]: crushValue
      }
      const newQs = new URLSearchParams(mergedValues);
      const newQsValue = newQs.toString()
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
    return [qsValue, dispatchFromUrl, ref, url];
  }
}
