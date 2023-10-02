import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _JSONUrl from "json-url";
import JSONCrush from "jsoncrush";
import moment from "moment";
import { base64ArrayBuffer } from "../DocumentGallery/b64util";
import { Base64 } from "js-base64";

const ENCODE_TYPES = {
  crush: 'crush',
  b64: 'b64',
  lzma: 'lzma',
}
export function useUrlState({ queryKey, defaultValue, disable = false, encode = ENCODE_TYPES.crush }) {
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
    if (!disable) {
      window?.history?.replaceState({ path: newurl }, "", newurl);
    }
  }, [disable]);

  const getQueryStringValue = useCallback(
    async () => {
      const qs = new URLSearchParams(window?.location?.search);
      const pValue = qs.get(queryKey) || state || null
      // const uncrush = JSONCrush.uncrush(decodeURIComponent(window?.location?.search))?.substring(1);

      let convertedValue = '';
      let getParam = ''
      let uncrush = '';
      if (pValue) {
        try {
          switch (encode) {
            case ENCODE_TYPES.crush:
              uncrush = JSONCrush.uncrush(decodeURIComponent(pValue))
              break;
            case ENCODE_TYPES.b64:
              uncrush = Base64.decode(pValue)
              break;
            case ENCODE_TYPES.lzma:
              uncrush = await JSONUrl.decompress(pValue)
              break;
            default:
              break;
          }
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
      const JSONUrl = _JSONUrl('lzma');
      const returnValue = typeof val === "function" ? val(ref.current) : val;
      const parsedValue = typeof returnValue === "object" ? JSON.stringify(returnValue) : returnValue;
      let crushValue = '';
      switch (encode) {
        case ENCODE_TYPES.crush:
          crushValue = JSONCrush.crush(parsedValue)
          break;
        case ENCODE_TYPES.b64:
          crushValue = Base64.encode(JSON.stringify(parsedValue))
          break;
        case ENCODE_TYPES.lzma:
          crushValue = await JSONUrl.compress(JSON.stringify(parsedValue))
          break;
        default:
          break;
      }

      setUrl({
        LZMA_compression: {
          raw: await JSONUrl.compress(JSON.stringify(parsedValue)),
          urlencoded: new URLSearchParams(await JSONUrl.compress(JSON.stringify(parsedValue)))?.toString(),
        },
        JS_Crush: {
          raw: JSONCrush.crush(JSON.stringify(parsedValue)),
          urlencoded: new URLSearchParams(JSONCrush.crush(JSON.stringify(parsedValue)))?.toString(),
        },
        B64: {
          raw: Base64.encode(JSON.stringify(parsedValue)),
          urlencoded: new URLSearchParams(Base64.encode(JSON.stringify(parsedValue)))?.toString(),
        },
      })
      const qs = new URLSearchParams(window?.location?.search);
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
      // setQueryString(`?${newQsValue}`);
      setQueryString(JSON.stringify(mergedValues))
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
