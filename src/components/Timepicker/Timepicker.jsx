import { TextField, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CustomPicker } from './CustomPicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileTimePicker, TimePicker } from '@mui/x-date-pickers';

const useStyles = makeStyles()((theme) => {
  return {}
});
const Timepicker = ({ value, onChange, label, inputProps }) => {
  const { classes } = useStyles()
  const input = useRef()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const [customPickerOpen, setCustomPickerOpen] = useState(false);

  const togglePicker = useCallback(
    () => {
      setCustomPickerOpen(!customPickerOpen);
    },
    [customPickerOpen],
  );

  const [open, setOpen] = useState(false);

  return <>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
        value={value}
        onChange={onChange}
        renderInput={(props) => (
          <TextField 
            {...props} 
            {...inputProps}
          />
        )}
      />
    </LocalizationProvider>
  </>;
}

export { Timepicker }