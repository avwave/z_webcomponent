import { Grid, makeStyles, ListItem, List, Box, Popover, Card, CardContent, Typography, Button } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { LitePicker } from './wrapper';
import clsx from 'clsx';
import moment from 'moment'

import { DateRange } from '@material-ui/icons';

const useStyles = makeStyles((theme) => {
  return {
    dateContentButton: {
      flex: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer'
    },
    dates: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      cursor: 'pointer',
      width: '100%',
      alignItems: 'center'
    },
    inline: {
      flexDirection: 'row'
    },
    divider: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    titlePadding: {
      paddingRight: theme.spacing(1)
    },
    form: {
      paddingTop: theme.spacing(2)
    }
  }
})
const DateTimeRange = (props) => {
  const classes = useStyles()
  return (
    <LitePicker {...props} />
  )
}

const DateTimeRangePicker = ({ size="medium", label, form, inline, onChange = () => { }, containerProps, ...props }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState(props?.value);

  const isEmptyDateRange = Boolean(!dateRange?.startDate && !dateRange?.endDate)
  const open = Boolean(anchorEl);

  useEffect(() => {
    setDateRange(props?.value)
  }, [props?.value]);

  return (
    <>
      {form ? (
        <Box className={clsx(classes.dateContentButton, form && classes.form)} onClick={(e) => setAnchorEl(e.currentTarget)}
        {...containerProps}>
          <div className={clsx(classes.dates, inline && classes.inline)}>
            <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">Start:</Typography>{dateRange?.startDate ? moment(dateRange?.startDate).format('L LT') : '-'}</Typography>
            {inline && <Typography variant="body2" className={classes.divider}> - </Typography>}
            <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">End:</Typography>{dateRange?.endDate ? moment(dateRange?.endDate).format('L LT') : '-'}</Typography>
          </div>
          <DateRange />
        </Box>
      ) : (
        <Button
          size={size}
          variant={isEmptyDateRange ? "outlined" : "contained"} 
          color={isEmptyDateRange ? "inherit" : "primary"}
          className={clsx(classes.dateContentButton, form && classes.form)}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          {...containerProps}
        >
          {label ? label : (
            <div className={clsx(classes.dates, inline && classes.inline)}>
              <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">Start:</Typography>{dateRange?.startDate ? moment(dateRange?.startDate).format('L LT') : '-'}</Typography>
              {inline && <Typography variant="body2" className={classes.divider}> - </Typography>}
              <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">End:</Typography>{dateRange?.endDate ? moment(dateRange?.endDate).format('L LT') : '-'}</Typography>
            </div>
          )}
          <DateRange fontSize="small"/>
        </Button>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: { width: '800px' },
        }}
      >
        <Box p={2}>
          <LitePicker {...props}
            onCancel={() => setAnchorEl(null)}
            onValueChange={(val) => {
              setDateRange(val)
              onChange(val)
            }} />
        </Box>
      </Popover>
    </>
  )
}

export { DateTimeRangePicker, DateTimeRange }