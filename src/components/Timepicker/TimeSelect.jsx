import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { SelectOption } from './SelectOption';

const useStyles = makeStyles()((theme) => {
  return {
    timeSelect: {
      padding: 8,
      display: "grid",
      gridAutoFlow: "column",
    },

    selectListHeading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "8px 0",
    },

    emptyHeading: {
      height: 32,
    },

    selectList: {
      gap: 8,
      overflowY: "scroll",
      height: "min-content",
      maxHeight: 175,
    },

    scroll: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    stack: {
      display: "grid",
      gridAutoFlow: "row",
    }
  }
});

const HOURS = [...Array(12).keys()].map((hour) => `${hour + 1}`)
const MINUTES = [...Array(12).keys()].map((minute) => (minute * 5).toString().padStart(2, '0'))
const AMPM = ['AM', 'PM']

const TimeSelect = ({ value, onChange }) => {
  const { classes, cx } = useStyles()

  const [hour, setHour] = useState(value?.format('h'));
  const [minute, setMinute] = useState(value?.format('mm'));
  const [amPm, setAmPm] = useState(value?.format('A'));

  useEffect(() => {
    const timeSelected = moment(`${hour}:${minute} ${amPm}`, "h:mm A");

    if (timeSelected.isValid()) {
      if (!timeSelected.isSame(value, "minute")) {
        onChange(timeSelected);
      }
    }
  }, [hour, minute, amPm, value, onChange]);

  return (
    <Box className={classes.timeSelect}>
      <Box>
        <Typography variant="overline" className={cx(classes.selectListHeading, classes.scroll)}>
          H
        </Typography>
        <div className={cx(classes.stack, classes.selectList, classes.scroll)}>
          {HOURS.map((hours) => (
            <SelectOption
              onClick={() => setHour(hours)}
              value={hours}
              key={hours}
              isActive={hour === hours}
            />
          ))}
        </div>
      </Box>
      <Box>
        <Typography variant="overline" className={cx(classes.selectListHeading, classes.scroll)}>
          M
        </Typography>
        <div className={cx(classes.stack, classes.selectList, classes.scroll)}>
          {MINUTES.map((minutes) => (
            <SelectOption
              onClick={() => setMinute(minutes)}
              value={minutes}
              key={minutes}
              isActive={minute === minutes}
            />
          ))}
        </div>
      </Box>
      <Box>
      <Typography variant="overline" className={cx(classes.selectListHeading, classes.scroll)}>
          AM/PM
        </Typography>
        <div className={cx(classes.stack, classes.selectList, classes.scroll)}>
          {AMPM.map((amPM) => (
            <SelectOption
              onClick={() => setAmPm(amPM)}
              value={amPM}
              key={amPM}
              isActive={amPm === amPM}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
}

export { TimeSelect }