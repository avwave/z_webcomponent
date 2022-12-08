import MomentUtils from '@material-ui/pickers/adapter/moment';
import { TextField, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { LocalizationProvider, MobileTimePicker, TimePicker } from '@material-ui/pickers';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CustomPicker } from './CustomPicker';

const useStyles = makeStyles((theme) => {
  return {}
})
const Timepicker = ({ value, onChange, label, inputProps }) => {
  const classes = useStyles()
  const input = useRef()

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
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


  return (
    <>
      <LocalizationProvider dateAdapter={MomentUtils}>
        {isMobile ? (
          <MobileTimePicker
            ref={input}
            label={label}
            value={value}
            defaultValue={null}
            onChange={newValue => onChange(newValue)}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...inputProps}
              />
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
                <TextField
                  {...inputParams}
                  {...inputProps}
                />
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
    </>
  )
}

export { Timepicker }