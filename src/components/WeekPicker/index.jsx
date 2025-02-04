import { Button, IconButton, TextField, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider, MobileDatePicker, PickersDay } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';


const useStyles = makeStyles()((theme) => {
  return {
    inputRoot: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    dayWrapper: {
      position: "relative"
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: "0 2px",
      color: "inherit"
    },
    customDayHighlight: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "2px",
      right: "2px",
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: "50%"
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled
    },
    highlightNonCurrentMonthDay: {
      color: "#676767"
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    endHighlight: {
      extend: "highlight",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%"
    },
    firstHighlight: {
      extend: "highlight",
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%"
    },
    weekNumber: {
      position: "absolute",
      fontSize: "0.7em",
      color: "#000",
      opacity: 0.3,
      top: 7,
      left: -12,
      padding: 4,
      width: 15,
      height: 15,
      textAlign: "center"
    },
    weekNumberHighlight: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "50%",
      opacity: 1,
      color: "#fff"
    },
    firstDayOfWeek: {
      // marginLeft: 15
    }
  }
});
const WeekPicker = ({
  startAccessor = "start_date",
  endAccessor = "end_date",
  labelStyle,
  labelClass,
  disableUnderline,
  value,
  asMonthPicker = false,
  onChange = () => { },
  ...props }) => {
  const { classes, cx } = useStyles()
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    setSelectedDate(moment(value));
  }, [value])
  
  const theme = useTheme()
  
  const RenderWrappedWeekDay = (props, b) => {
    const selectedDate = moment(props.selectedDate)
    const {  day: date , ...pickerProps } = props;
    
    let selectedDateClone = selectedDate

    const dateC = moment(date).startOf("day").toDate();
    const start = moment(selectedDateClone).startOf("week").toDate();
    const end = moment(selectedDateClone).endOf("week").toDate();

    const dayIsBetween = date.isBetween(start, end, null, []);
    const isFirstDay = date.isSame(start, "day");
    const isLastDay = date.isSame(end, "day");

    const isFirstDayOfWeek = date.weekday() === 1;

    const wrapperClassName = cx({
      
      [classes.firstHighlight]: isFirstDay && dayIsBetween,
      [classes.endHighlight]: isLastDay && dayIsBetween,
      [classes.firstDayOfWeek]: isFirstDayOfWeek && dayIsBetween
    });

    const wrapperStyle = {
      width: 40,
      margin:0,
      ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      ...(isFirstDay && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
      }),
      ...(isLastDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
      }),
    }

    return (
      <PickersDay
      day={date}
      today
      style={wrapperStyle}
      {...pickerProps}
      />
    )
  };

  const [open, setOpen] = useState(false);

  return (
    <MobileDatePicker
      closeOnSelect
      disableMaskedInput
      showDaysOutsideCurrentMonth
      showToolbar={false}
      slots={{
        field: ButtonField,
        day: RenderWrappedWeekDay
      }}
      slotProps={{
        field:{
          setOpen,
          label: asMonthPicker ? moment(selectedDate).format('MMMM YYYY') : `${moment(selectedDate).startOf('week').format('ll')} - ${moment(selectedDate).endOf('week').format('ll')}`
        },
        day: {
          selectedDate:selectedDate
        }
      }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      onChange={evt => setSelectedDate(evt)}
      onAccept={evt => {
        if (asMonthPicker) {
          onChange({
            [startAccessor]: evt.clone().startOf('day').startOf('month'),
            [endAccessor]: evt.clone().endOf('day').endOf('month'),
            date: evt.clone().startOf('day')
          });
        } else {
          onChange({
            [startAccessor]: evt.clone().startOf('day').startOf('week'),
            [endAccessor]: evt.clone().endOf('day').endOf('week'),
            date: evt.clone().startOf('day')
          });
        }
      }}
      views={asMonthPicker ? ['year', 'month'] : ['year', 'month', 'day']}
      value={selectedDate}
      onError={(reason, value) => {
        console.log('wrapper.jsx (204) # reason, value', reason, value);
      }}

      components={{
        ActionBar: () => null,
      }}
      {...props}
    />
  )
}

const ButtonField = (props) => {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  );
}

const WrapPicker = props => {
  //NOTE: Use this pattern to set the filters beforehand to prevent unecessary rerendering
  // const [state, dispatch] = useReducer(dataGridReducer, { ...initState, filterColumn: { partner: '', statuses: '' } });
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <WeekPicker {...props} />
    </LocalizationProvider>
  );
};

export { WrapPicker as WeekPicker, ButtonField as WeekPickerButtonField };
