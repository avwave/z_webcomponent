import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { SchedulerMonthly } from './SchedulerMonthly';
import { SchedulerWeekly } from './SchedulerWeekly';
import { SchedulerDaily } from './SchedulerDaily';
import { SchedulerHourly } from './SchedulerHourly';
import { Box, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment-timezone';

const useStyles = makeStyles()(theme => ({
}));
const SchedulerSelector = ({
  onChange = (schedule) => { },
  editable = false,
  frequency = 'monthly',
  day = 1,
  day_of_week = 1,
  hour = 0,
  minute = 0,
  ...props
}) => {
  const { classes } = useStyles()
  const [state, setState] = useState({
    frequency,
    day,
    day_of_week,
    hour,
    minute,
  });

  useEffect(
    () => {
      onChange(state);
    }, [state, onChange]
  );

  switch (frequency) {
    case 'monthly':
      return <SchedulerMonthly onChange={(v) => setState({
        frequency: 'monthly',
        day_of_week: v.day_of_week,
        day: v.day,
        hour: v.hour,
        minute: v.minute
      })}
        value={state}
        {...props}
      />;
    case 'weekly':
      return <SchedulerWeekly onChange={(v) => setState({
        frequency: 'weekly',
        day_of_week: v.day_of_week,
        hour: v.hour,
        minute: v.minute
      })}
        value={state}
        {...props}
      />;
    case 'daily':
      return <SchedulerDaily onChange={(v) => setState({
        frequency: 'daily',
        hour: v.hour,
        minute: v.minute
      })}
        value={state}
        {...props}
      />;
    case 'hourly':
      return <SchedulerHourly onChange={(v) => setState({
        frequency: 'hourly',
        minute: v.minute
      })}
        value={state}
        {...props}
      />;
    default:
      return <div>Select frequency</div>;
  }
}

const SchedulerUI = ({
  onChange = (schedule) => { },
  editable = false,
  frequency = 'monthly',
  day,
  day_of_week,
  hour,
  minute,
  schedule_time,
  ...props
}) => {
  const [state, setState] = useState({
    frequency,
    day,
    day_of_week,
    hour,
    minute,
    schedule_time
  });

  const [isRepeating, setIsRepeating] = useState(`${!!frequency}`);

  useEffect(
    () => {
      onChange(state);
    }, [state]
  );
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <FormControl>
        <RadioGroup
          row
          value={isRepeating}
          onChange={(e) => {
            setIsRepeating(e.target.value)
            if (e.target.value === 'false') {
              setState({ frequency: null, schedule_time: null })
            }
          }}
        >
          <FormControlLabel value={true} control={<Radio />} label="Repeating" />
          <FormControlLabel value={false} control={<Radio />} label="One time" />
        </RadioGroup>
      </FormControl>
      {
        isRepeating === 'true' ? (
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
          >
            <Select
              value={state.frequency}
              onChange={(e) => setState({ ...state, frequency: e.target.value })}
              {...props}
            >
              {['monthly', 'weekly', 'daily', 'hourly'].map((frequency, i) => (
                <MenuItem key={i} value={frequency}>{frequency}</MenuItem>
              ))}
            </Select>
            <SchedulerSelector
              onChange={v => onChange(v)}
              editable={editable}
              frequency={state.frequency}
              day={state.day}
              day_of_week={state.day_of_week}
              hour={state.hour}
              minute={state.minute}
              {...props}
            />
          </Box>

        ) : (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              slotProps={{
                textField: {
                  ...props
                }
              }}
              label="Schedule Time"
              onChange={(evt, val) => {
                setState({ frequency: null, schedule_time: evt.toISOString() })
              }}
              value={moment(state.schedule_time)}
              variant="inline"
            />
          </LocalizationProvider>
        )
      }
    </Box>

  )
}


export { SchedulerSelector, SchedulerUI }