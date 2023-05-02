import React, { forwardRef, useEffect, useMemo, useState } from 'react';

import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";

const MPhoneInput = forwardRef((props, ref) => {
  return (
    <PhoneInput {...props}
      ref={props.inputRef}
    />

  )
})

export { MPhoneInput }