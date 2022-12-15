
import { Checkbox } from '@mui/material';
import React, { forwardRef, Ref, useEffect, useRef, useState } from 'react';

function TriStateCheckbox({ name, checked, onFocus, onChange, onBlur }, ref){
  const [localChecked, setLocalChecked] = useState(checked ?? null);
  // useEffect(() => setLocalChecked(checked ?? null), [checked]);
  const initRender = useRef(true)

  const handleChange = () => {
    switch (localChecked) {
      case true:
        setLocalChecked(false);
        break;
      case false:
        setLocalChecked(null);
        break;
      default:
        setLocalChecked(true);
        break;
    }
  };

  useEffect(()=> {
    if (initRender.current) {
      initRender.current = false
    } else {
      if (onChange) {
        console.log("📢[TriStateSelect.js:21]:", localChecked);
        onChange(localChecked);
      }
    }
  }, [localChecked])
  
  const handleBlur = () => {
    if (onBlur) {
      onBlur(localChecked);
    }
  };
  return (
    <Checkbox
      inputRef={ref}
      name={name}
      checked={!!localChecked}
      indeterminate={localChecked === null}
      onFocus={onFocus}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default forwardRef(TriStateCheckbox);