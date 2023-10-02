import React, { useCallback, useMemo, useRef, useState } from "react";
import _JSONUrl from "json-url";
import moment from "moment";

export function useUrlState({ queryKey, defaultValue, disable = false }) {
  const JSONUrl = _JSONUrl('lzma');
  const [state, setState] = useState(defaultValue);
  const ref = useRef(state);
  const [url, setUrl] = useState('');
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

  const getQueryStringValue = useMemo(
    async () => {
    const qs = new URLSearchParams(window.location.search);
    const pValue = qs.get(queryKey) || state || null
    // const uncrush = JSONCrush.uncrush(decodeURIComponent(window.location.search))?.substring(1);
    
    let convertedValue = pValue;
    if (pValue) {
      try {
        const uncrush = await JSONUrl.decompress(window.location.search.substring(1))
        const getParam = uncrush ? JSON.parse(uncrush) : {};    
        convertedValue = JSON.parse(getParam?.[queryKey]);
        const calltype = Object.prototype.toString.call(convertedValue)
        if (calltype === '[object String]') {
          try {
            const isDate = moment(new Date(convertedValue)).isValid();
            convertedValue = isDate ? moment(convertedValue).toDate() : convertedValue;
          } catch (dateparseError) {
          }
        }
      } catch (error) {
        convertedValue = pValue;
      }
      ref.current = convertedValue;
    }
    return ref.current;
  }, [queryKey, state]);

  const dispatchFromUrl = useCallback(
    async function (val) {
      const returnValue = typeof val === "function" ? val(ref.current) : val;
      const parsedValue = typeof returnValue === "object" ? JSON.stringify(returnValue) : returnValue;

      const qs = new URLSearchParams(window.location.search);
      let values = {};
      for (var value of qs.keys()) {
        values[value] = qs.get(value);
      }
      const mergedValues = {
        ...values,
        [queryKey]: parsedValue
      }
      const newQs = new URLSearchParams(mergedValues);
      const newQsValue = newQs.toString()

      // const crushValue = JSONCrush.crush(JSON.stringify(mergedValues));
      const crushValue = await JSONUrl.compress(JSON.stringify(mergedValues));

      setQueryString(`?${crushValue}`);
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
    return [getQueryStringValue, dispatchFromUrl, ref, url];
  }
}
