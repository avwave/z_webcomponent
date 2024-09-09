import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { SchedulerDaily } from './SchedulerDaily';

const useStyles = makeStyles()(theme => ({
}));
const SchedulerWeekly = ({
  onChange=(v)=>{},
  value,
  hidePrefix = false,
  ...props
}) => {
  const { classes } = useStyles()
  const [state, setState] = useState({
    day_of_week: value.day_of_week,
    hour: value.hour,
    minute: value.minute,
  });

  const [dayOfWeek, setDayOfWeek] = useState(`${value.day_of_week}`);

  useEffect(
    () => {
      onChange(state);
    }, [state]
  );
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
    >
      {!hidePrefix && <Typography>Every</Typography>}
      <Select
        value={dayOfWeek}
        onChange={(e) => {
          setState({ ...state, day_of_week: e.target.value })
          setDayOfWeek(e.target.value)
        }}
        {...props}
      >
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
          <MenuItem key={i} value={`${i}`}>{day}</MenuItem>
        ))}
      </Select>
      <Typography>at</Typography>
      <SchedulerDaily
        onChange={(v) => setState({ ...state, hour: v.hour, minute: v.minute })}
        value={state}
        hidePrefix
        {...props}
      />
    </Box>
  )
}

export { SchedulerWeekly }