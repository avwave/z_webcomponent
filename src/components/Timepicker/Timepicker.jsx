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
      {isMobile ? (
        <MobileTimePicker
          ref={input}
          label={label}
          value={value}
          defaultValue={null}
          onChange={newValue => onChange(newValue)}
          renderInput={(inputParams) => (
            <TextField variant="standard" {...inputParams} {...inputProps} />
          )}
          InputAdornmentProps={{
            onClick: togglePicker,
          }}
        />
      )
        : (
          <TimePicker
            ref={input}
            label={label}
            value={value}
            open={false}
            defaultValue={null}
            onChange={newValue => onChange(newValue)}
            renderInput={(inputParams) => (
              <TextField variant="standard" {...inputParams} {...inputProps} />
            )}
            InputAdornmentProps={{
              onClick: togglePicker,
            }}
          />
        )
      }
    </LocalizationProvider>
    {input.current && (
      <CustomPicker
        value={value}
        onChange={onChange}
        open={customPickerOpen}
        anchorEl={input.current}
        onClose={togglePicker}
      />
    )}
  </>;
}

export { Timepicker }