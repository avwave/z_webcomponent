import { Grid, makeStyles, ListItem, List, Box, Popover, Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { LitePicker } from './wrapper';
import { Button } from '../../stories/Button';
import clsx from 'clsx';
import moment from 'moment'

import { DateRange } from '@material-ui/icons';

const useStyles = makeStyles((theme) => {
  return {
    dateContentButton: {
      width: '100%',
      flex: '1 1 auto',
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
      width: '100%'
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

const DateTimeRangePicker = ({ form, inline, onChange = () => { }, ...props }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState(props?.value);

  const open = Boolean(anchorEl);

  return (
    <>
      <Box className={clsx(classes.dateContentButton, form && classes.form)} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <div className={clsx(classes.dates, inline && classes.inline)}>
          <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">Start:</Typography>{moment(dateRange?.startDate).format('LL, LT')}</Typography>
          {inline && <Typography variant="body2" className={classes.divider}> - </Typography>}
          <Typography variant="body2"><Typography className={classes.titlePadding} variant="button">End:</Typography>{moment(dateRange?.endDate).format('LL, LT')}</Typography>
        </div>
        <DateRange />
      </Box>
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
          <LitePicker {...props} onValueChange={(val) => {
            setDateRange(val)
            onChange(val)
          }} />
        </Box>
      </Popover>
    </>
  )
}

export { DateTimeRangePicker, DateTimeRange }