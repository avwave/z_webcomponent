import { Button, ButtonGroup, Grid, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useStateRef } from '../hooks/useStateRef';

import LitePickerLib from 'litepicker/dist/nocss/litepicker.umd';
// import NoCssLP from 'litepicker/dist/nocss/litepicker.umd';
import 'litepicker/dist/plugins/mobilefriendly';
import 'litepicker/dist/plugins/ranges';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Timepicker } from '../Timepicker';
import './style.scss';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import isEmpty from 'lodash.isempty';
import dayjs from 'dayjs';

const useStyles = makeStyles()((theme) => {
  return {
    pickerContainer: {
      width: "100%",
    },
    calendarHolder: {
      // width: "100%",
    },
    rangeSelectContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    bottomBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    spacer: {
      flex: '1 1 auto'
    },
    rangeButton: {
      justifyContent: 'flex-start'
    }
  }
});

const RANGE_CONST = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  LAST_WEEK: "Last Week",
  THIS_MONTH: "This Month",
  LAST_MONTH: "Last Month",
}

const LitePicker = ({
  immediate = false,
  onCancel = () => { }, onValueChange = () => { }, containerProps, variant = "outlined", ...props }) => {
  const { classes } = useStyles()
  const startElement = useRef(null)
  const endElement = useRef(null)
  const parentElement = useRef(null)
  const picker = useRef()

  const [startTime, setStartTime, startTimeRef] = useStateRef(moment(props?.value?.startDate || new Date()));
  const [endTime, setEndTime, endTimeRef] = useStateRef(moment(props?.value?.endDate || new Date()));
  const [startDate, setStartDate, startDateRef] = useStateRef(moment(props?.value?.startDate || new Date()));
  const [endDate, setEndDate, endDateRef] = useStateRef(moment(props?.value?.endDate || new Date()));

  const [dateRange, setDateRange] = useState([null, null]);
  const [date1, setDate1] = useState(new Date());

  useEffect(() => {
    if (!picker.current) {
      const pickerElem = new LitePickerLib({
        parentEl: parentElement.current,
        element: startElement.current,
        elementEnd: endElement.current,
        startDate: new Date(),
        inlineMode: true,
        singleMode: false,
        numberOfMonths: 2,
        showTooltip: true,
        firstDay: 0,
        numberOfColumns: 2,
        autoRefresh: true,
        resetButton: true,
        allowRepick: false,
        dropdowns: {
          months: true,
          years: "asc",
          maxYear: 2099,
          minYear: 1900
        },
        plugins: [
          'mobilefriendly',
          // 'ranges'
        ],
        setup: (picker) => {
          picker.on('before:show', () => {
            picker.gotoDate(moment().subtract(1, 'month').toDate());

          });

        },
        ...props
      })
      pickerElem.on('selected', (date1, date2) => {
        setStartDate(moment(date1.dateInstance))
        setEndDate(moment(date2.dateInstance))
        immediate && sendParsedDates()
      })

      pickerElem.setDateRange(moment(startDate), moment(endDate))
      pickerElem.gotoDate(moment(startDate));
      picker.current = pickerElem
    }
  }, []);

  const mergeTime = useCallback(
    (_src, _dest) => {
      const src = moment(_src);
      const dest = moment(_dest);
      const newTime = dest.set({ 'hour': src.get('hour'), 'minute': src.get('minute'), 'second': src.get('second') });
      return newTime.toDate()
    },
    [],
  );



  const sendParsedDates = useCallback(
    () => {
      const val = {
        startDate: mergeTime(startTimeRef?.current, startDateRef?.current),
        endDate: mergeTime(endTimeRef?.current, endDateRef?.current),
      }
      onValueChange({ ...val })
    },
    [endDateRef, endTimeRef, mergeTime, onValueChange, startDateRef, startTimeRef],
  );

  const clearDates = useCallback(
    () => {
      setStartTime(null)
      setStartDate(null)
      setEndTime(null)
      setEndDate(null)
      onValueChange({
        startDate: null,
        endDate: null
      })
    },
    [onValueChange],
  );

  const setRange = useCallback(
    (range) => {
      switch (range) {
        case RANGE_CONST.TODAY:
          picker.current.setDateRange(moment().startOf('day'), moment().endOf('day'))
          picker.current.gotoDate(moment());
          break;
        case RANGE_CONST.THIS_WEEK:
          picker.current.setDateRange(moment().startOf('week'), moment().endOf('week'))
          picker.current.gotoDate(moment().startOf('week'));
          break
        case RANGE_CONST.LAST_WEEK:
          picker.current.setDateRange(moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week'))
          picker.current.gotoDate(moment().subtract(1, 'week').startOf('week'));
          break;
        case RANGE_CONST.THIS_MONTH:
          picker.current.setDateRange(moment().startOf('month'), moment().endOf('month'))
          picker.current.gotoDate(moment().startOf('month'));
          break;
        case RANGE_CONST.LAST_MONTH:
          picker.current.setDateRange(moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'))
          picker.current.gotoDate(moment().subtract(1, 'month').startOf('month'));
          break;
        default:
          break;
      }

    },
    [],
  );
  return (
    <Grid container spacing={2} className={classes.pickerContainer} {...containerProps} >
      <Grid item xs={6}>
        <DatePicker
          slotProps={{
            textField: {
              variant
            }
          }}
          ref={startElement}
          label="Start Date"
          renderInput={
            (props) => <TextField
              {...props}
              fullWidth
              size="small"
              name="startDate"
              helperText=" "
              variant={variant}
              InputLabelProps={{
                shrink: true,
              }}

            />
          }
          onChange={evt => {
            setStartDate(evt)
            immediate && sendParsedDates()
            if (picker.current) {
              picker.current.setDateRange(evt, endDate)
            }
          }}
          value={startDate}
          onError={(reason, value) => {
            console.log('wrapper.jsx (204) # reason, value', reason, value);
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Timepicker
          onChange={evt => {
            setStartTime(evt)
            immediate && sendParsedDates()
          }}
          label="Start Time"
          value={startTime}
          inputProps={{
            fullWidth: true,
            InputLabelProps: {
              shrink: true,
            },
            variant: variant,
            size: "small",
            helperText: '',
            slotProps: {
              textField: {
                variant
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePicker
          slotProps={{
            textField: {
              variant
            }
          }}
          label="End Date"
          ref={endElement}
          renderInput={
            (props) => <TextField
              {...props}
              fullWidth
              size="small"
              name="endDate"
              helperText=" "
              variant={variant}
              InputLabelProps={{
                shrink: true,
              }}

            />
          }
          onChange={evt => {
            setEndDate(evt)
            immediate && sendParsedDates()
            if (picker.current) {
              picker.current.setDateRange(startDate, evt)
            }
          }}
          value={endDate}
        />

      </Grid>
      <Grid item xs={6}>
        <Timepicker
          onChange={evt => {
            setEndTime(evt)
            immediate && sendParsedDates()
          }}
          label="End Time"
          value={endTime}
          inputProps={{
            fullWidth: true,
            InputLabelProps: {
              shrink: true,
            },
            variant: variant,
            size: "small",
            helperText: '',
            slotProps: {
              textField: {
                variant
              }
            }
          }}
        />
      </Grid>
      <Grid container item xs={12} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12} className={classes.calendarHolder} ref={parentElement} />
        <Grid item xs={12} className={classes.rangeSelectContainer} >
          <ButtonGroup disableElevation variant="text" size="small" >
            {Object.entries(RANGE_CONST).map(([key, value]) =>
              <Button className={classes.rangeButton} key={key} size="small" onClick={() => setRange(value)}>{value}</Button>
            )}
          </ButtonGroup>
        </Grid>
        {!immediate && (
          <Grid item xs={12} className={classes.bottomBar}>
            <Button variant="text" color="inherit"
              onClick={() => onCancel()
              }>Close</Button>
            <div className={classes.spacer} />
            <Button variant="text" color="primary"
              onClick={() => {
                sendParsedDates()
                onCancel()

              }}>Apply</Button>
            <Button variant="text" color="secondary"
              onClick={() => clearDates()
              }>Clear</Button>


          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

const WrapPicker = props => {
  //NOTE: Use this pattern to set the filters beforehand to prevent unecessary rerendering
  // const [state, dispatch] = useReducer(dataGridReducer, { ...initState, filterColumn: { partner: '', statuses: '' } });
  let nProps = { ...props };
  if (isEmpty(props.value)) {
    nProps = {
      ...props,
      value: {
        startDate: null,
        endDate: null,
      }
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <LitePicker {...nProps} />
    </LocalizationProvider>
  );
};

export { WrapPicker as LitePicker };

