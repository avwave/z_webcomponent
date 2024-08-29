import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { ColumnSelector } from './SchedulerHourly';
import { SchedulerDaily } from './SchedulerDaily';

const useStyles = makeStyles()(theme => ({
}));
const SchedulerMonthly = ({ 
  onChange=(v)=>{},
  value,
  hidePrefix = false,
  ...props
}) => {
  const { classes } = useStyles()
  const [state, setState] = useState({
    day: value.day,
    hour: value.hour,
    minute: value.minute,
  });

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
      <ColumnSelector
        startAtOne
        value={value.day}
        onChange={(day) => setState({ ...state, day })}
        rangeEnd={31}
        showSuffix={true}
        suffix="day"
        batch={7}
        {...props}
      />
      <Typography>on</Typography>
      <SchedulerDaily
        onChange={(v) => setState({ ...state, hour: v.hour, minute: v.minute })}
        value={state}
        hidePrefix
        {...props}
      />
    </Box>
  )
}

export { SchedulerMonthly }