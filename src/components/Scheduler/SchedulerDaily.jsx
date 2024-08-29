import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ColumnSelector } from './SchedulerHourly';
import { Box, Typography } from '@mui/material';

const useStyles = makeStyles()(theme => ({
}));
const SchedulerDaily = ({
  onChange=(v)=>{},
  value,
  hidePrefix = false,
  ...props
}) => {
  const { classes } = useStyles()
  const [state, setState] = useState({
    hour: value.hour,
    minute: value.minute,
  });

  useEffect(
    () => {
      onChange(state);
    }, [onChange, state]
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
        value={value.hour}
        onChange={(hour) => setState({ ...state, hour })}
        rangeEnd={24}
        showSuffix={false}
        suffix="hour"
        batch={6}
        {...props}
      />
      <Typography>:</Typography>
      <ColumnSelector
        value={value.minute}
        onChange={(minute) => setState({ ...state, minute })}
        rangeEnd={60}
        showSuffix={false}
        suffix="minute"
        {...props}
      />
    </Box>
  )
}

export { SchedulerDaily }