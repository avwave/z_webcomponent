import { useCallback, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import isEqual from "react-fast-compare";
import useComponentWillMount from "./useComponentWillMount";

const DEFAULT_PROPS = {
  debounceWaitMs: 300,
  clearOnOnmount: true,
  saveOnlyOnSubmit: false,
  parse: JSON.parse,
  dump: JSON.stringify,
};

const FormikPersist = (props) => {
  const internalClear = window.localStorage.removeItem.bind(window.localStorage);

  const {
    getData = window.localStorage.getItem.bind(window.localStorage),
    setData = window.localStorage.setItem.bind(window.localStorage),
    clearData = window.localStorage.removeItem.bind(window.localStorage),
    name,
    parse,
    dump,
    clearOnOnmount,
    saveOnlyOnSubmit,
    onLoaded,
    reset = false,
    resetCallback=()=>{}
  } = Object.assign(DEFAULT_PROPS, props);

  const { setValues, values, isSubmitting, dirty } = useFormikContext();

  const savedValues = useRef();

  // Debounce doesn't work with tests
  const saveForm = useCallback(
    (data) => {
      const stringData = dump(data);

      setData(name, stringData);
    },
    [dump, setData, name]
  );

  // Load state from storage
  useComponentWillMount(() => {
    const stringData = getData(name);

    if (stringData) {
      const initsavedValues = parse(stringData);

      if (!isEqual(initsavedValues, values)) {
        savedValues.current = initsavedValues;
        setValues(initsavedValues);

        if (onLoaded) {
          onLoaded(initsavedValues);
        }
      }
    }
  });
  // Clear state
  useEffect(() => {
    if (reset && !!resetCallback) {
      internalClear(name)
      resetCallback(false)
    }
  }, [internalClear, name, reset, resetCallback]);

  // Save state
  useEffect(() => {
    if (!saveOnlyOnSubmit && !isEqual(values, savedValues.current) && dirty) {
      saveForm(values);
    }
  }, [values, saveForm, saveOnlyOnSubmit, dirty]);

  // Clear data after unmount
  useEffect(
    () => () => {
      if (clearOnOnmount && isSubmitting) {
        clearData(name);
      }
    },
    [clearOnOnmount, isSubmitting, clearData, name]
  );

  // saveOnlyOnSubmit
  useEffect(
    () => () => {
      if (saveOnlyOnSubmit && isSubmitting) {
        saveForm(values);
      }
    },
    [saveOnlyOnSubmit, isSubmitting, saveForm, values]
  );

  return null;
};

export { FormikPersist };
