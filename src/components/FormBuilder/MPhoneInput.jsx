import { makeStyles } from '@material-ui/core';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';

import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";


const useStyles = makeStyles((theme) => {
  return {}
})
const MPhoneInput = forwardRef((props, ref) => {
  const classes = useStyles()
  return (
    <PhoneInput {...props}
      ref={props.inputRef} 
    />

  )
})

export { MPhoneInput }