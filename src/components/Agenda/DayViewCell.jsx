import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardContent,
  Chip,
  darken,
  Divider,
  Link,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { red, yellow } from '@mui/material/colors';
import clsx from 'clsx';
import moment from 'moment';
import { memo, useCallback, useMemo } from 'react';
import { personNameFormal } from '../utils/format';

import { parseBookingStatus } from './bookingStates';

const useStyles = makeStyles((theme) => {
  return {
    dayView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      "&> .rbc-event": {
        borderColor: props => `${props?.bgColor ? darken(props?.bgColor, .15) : 'transparent'} !important`,
        borderLeftWidth: `3px !important`,
        borderLeftColor: props => `${props?.textColor ? props?.textColor : 'transparent'} !important`,
        backgroundColor: props => `${props?.bgColor ?? 'transparent'} !important`
      }
    },
    aggregateCell: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      "&> .rbc-event": {
        borderColor: `${theme.palette.primary.main} !important`,
        borderLeftWidth: `3px !important`,
        borderLeftColor: `${theme.palette.primary.main} !important`,
        backgroundColor: `${theme.palette.grey[100]} !important`,
        color: `${theme.palette.primary.contrastText} !important`
      }
    },
    high_congested: {
      "&> .rbc-event": {
        borderColor: `${theme.palette.error.main} !important`,
        borderLeftWidth: `3px !important`,
        borderLeftColor: `${theme.palette.error.main} !important`,
        backgroundColor: `${red[50]} !important`,
        color: `${theme.palette.error.contrastText} !important`
      }
    },
    med_congested: {
      "&> .rbc-event": {
        borderColor: `${theme.palette.warning.main} !important`,
        borderLeftWidth: `3px !important`,
        borderLeftColor: `${theme.palette.warning.main} !important`,
        backgroundColor: `${yellow[50]} !important`,
        color: `${theme.palette.warning.contrastText} !important`
      }
    },
    dot: {
      fontSize: 10,
      marginRight: 5
    },
    popupcard: {
      backgroundColor: theme.palette.grey[50],
    },
    tooltip: {
      backgroundColor: theme.palette.grey[50],
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: '.85rem',
      borderRadius: 20
    }
  }
})
const DayViewCell = ({ event, ...rest }) => {
  const classes = useStyles()
  const { booking } = event?.event
  const start = moment(booking?.date_scheduled)

  const parse = parseBookingStatus(booking)
  return (
    <Chip
      style={{
        marginLeft: "5px",
        background: parse?.variant === 'outlined' ? 'inherit' : parse?.bgColor,
        color: parse?.variant === 'outlined' ? parse?.textColor : 'inherit',
      }}
      size="small"
      variant={parse?.variant}
      label={`${start.format('LT')} - ${booking?.type?.label}`}
    />
  )
}

const WeekViewCell = ({ event, ...rest }) => {
  const classes = useStyles()
  const { booking } = event?.event
  const start = moment(booking?.date_scheduled)
  const parse = parseBookingStatus(booking)
  return (
    <Typography
      variant='caption'>
      {booking?.type?.label} - {personNameFormal(booking?.white_label_customer)}
    </Typography>

  )
}

const AggregateEventCell = ({ event, children }) => {
  const evtLinker = useMemo(
    () => {
      return event?.event?.events?.length
    }, [event]
  );
  return (
    <Link to={`/client-profile/${event?.white_label_customer?.client?.id}`}>
      <Typography variant="caption">{evtLinker} bookings</Typography>
    </Link>
  )
}
const SLOT_HIGH_CONGESTION = 15
const SLOT_MED_CONGESTION = 10
const AggregateCell = ({ event, children }) => {
  const classes = useStyles()
  const congestionClass = useMemo(
    () => {
      if (event?.events?.length >= SLOT_HIGH_CONGESTION) {
        return classes.high_congested
      } else if (event?.events?.length >= SLOT_MED_CONGESTION) {
        return classes.med_congested
      } else {
        return null
      }
    }, [event]
  );
  return (
    <div className={clsx(classes.aggregateCell, congestionClass)}>
      {children}
      

    </div>
  )
}

const DayViewHeader = memo(({ event, date, dateLoadingArray }) => {
  const classes = useStyles()
  const theme = useTheme()
  const loading = useMemo(
    () => {
      const foundDate = dateLoadingArray.find(d => {
        const targetDate = d.date.startOf('day')
        const eventDate = moment(date?.date).startOf('day')
        return eventDate.isSame(targetDate)
      })
      return foundDate?.loading

    }, [date?.date, dateLoadingArray]
  );
  return (
    <Typography
      component="a"
      onClick={(e) => {
        date?.onDrillDown(e)
      }}
      variant='caption'>
      <FontAwesomeIcon icon={faSpinner} spin color={loading ? theme.palette.primary.main : 'transparent'} />
      {date?.label}
    </Typography>

  )
})

const DayViewToolTip = ({ event, children, view }) => {
  const { booking } = event

  const parse = parseBookingStatus(booking)
  const classes = useStyles(parse)

  const start = moment(booking?.date_scheduled)
  const end = moment(booking?.date_scheduled_end)
  const tooltipContent = useMemo(
    () => {
      const parse = parseBookingStatus(event?.booking)
      return (
        <Card elevation={0} className={classes.popupcard}>
          <CardContent>
            <Link to={`/client-profile/${booking?.white_label_customer?.client?.id}`}>{personNameFormal(booking?.white_label_customer)}</Link>
            <Divider />
            <Typography variant="caption">{booking?.id}</Typography>
            <Typography variant="body2">{booking?.type?.label}</Typography>
            <Typography variant="body2">{start.format('ll')}</Typography>
            <Typography variant="body2">{start.format(' LT')} - {end.format('LT')}</Typography>
            <Chip
              size="small"
              style={{
                background: parse?.variant === 'outlined' ? 'inherit' : parse?.bgColor,
                color: parse?.variant === 'outlined' ? parse?.textColor : 'inherit',
              }}
              variant={parse?.variant}
              label={parse?.value}
            />
          </CardContent>
        </Card>
      )

    }, [booking, event, end, start]
  );
  return (
    <div className={view !== 'date' ? classes.dayView : null}>
      <Tooltip
        arrow
        placement='right'
        classes={{
          tooltip: classes.tooltip
        }}
        PopperProps={{
          modifiers: {
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'window',
            },
          }
        }}
        interactive
        title={tooltipContent}>
        {children}
      </Tooltip>
    </div>
  )
}
export { AggregateEventCell, AggregateCell, DayViewHeader, DayViewCell, WeekViewCell, DayViewToolTip };
