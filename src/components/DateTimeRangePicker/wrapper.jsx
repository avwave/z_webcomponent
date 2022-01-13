import { Button, ButtonGroup, Grid, makeStyles, TextField } from '@material-ui/core';
import { DatePicker, LocalizationProvider } from '@material-ui/pickers';
import LitePickerLib from 'litepicker/dist/nocss/litepicker.umd';
// import NoCssLP from 'litepicker/dist/nocss/litepicker.umd';
import 'litepicker/dist/plugins/mobilefriendly';
import 'litepicker/dist/plugins/ranges';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';
import MomentUtils from '@material-ui/pickers/adapter/moment';


const useStyles = makeStyles((theme) => {
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
})

const RANGE_CONST = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  LAST_WEEK: "Last Week",
  THIS_MONTH: "This Month",
  LAST_MONTH: "Last Month",
}

const LitePicker = ({ onCancel = () => { }, onValueChange = () => { }, containerProps, variant = "outlined", ...props }) => {
  const classes = useStyles()
  const startElement = useRef(null)
  const endElement = useRef(null)
  const parentElement = useRef(null)
  const picker = useRef()

  const [startTime, setStartTime] = useState(props?.value?.startDate);
  const [endTime, setEndTime] = useState(props?.value?.endDate);
  const [startDate, setStartDate] = useState(props?.value?.startDate ?? new Date());
  const [endDate, setEndDate] = useState(props?.value?.endDate ?? new Date());


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
        setStartDate(date1)
        setEndDate(date2)
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
        startDate: mergeTime(startTime, startDate?.dateInstance),
        endDate: mergeTime(endTime, endDate?.dateInstance),
      }
      onValueChange({ ...val })
    },
    [endDate?.dateInstance, endTime, mergeTime, onValueChange, startDate?.dateInstance, startTime],
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
          ref={startElement}
          label="Start Date"
          renderInput={
            (props) => <TextField
            {...props}
              fullWidth
              size="small"
              name="startDate"
              type="date"
              helperText=" "
              variant={variant}
              InputLabelProps={{
                shrink: true,
              }}
              
            />
          }
          onChange={evt => {
            setStartDate({ ...startDate, dateInstance: evt })
            if (picker.current) {
              picker.current.setDateRange(evt, endDate)
            }
          }}
          value={startDate?.dateInstance}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          size="small"
          value={moment(startTime).format("HH:mm")}
          onChange={evt => {
            setStartTime(moment(evt.target.value, ['hh:mm a', 'HH:mm']).toDate())
          }}
          name="startTime"
          type="time"
          label="Start Time"
          InputLabelProps={{
            shrink: true,
          }}
          variant={variant}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePicker
          label="End Date"
          ref={endElement}
          renderInput={
            (props) => <TextField
            {...props}
              fullWidth
              size="small"
              name="endDate"
              type="date"
              helperText=" "
              variant={variant}
              InputLabelProps={{
                shrink: true,
              }}
              
            />
          }
          onChange={evt => {
            setEndDate({ ...endDate, dateInstance: evt })
            if (picker.current) {
              picker.current.setDateRange(startDate, evt)
            }
          }}
          value={endDate?.dateInstance}
        />

      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          size="small"
          value={moment(endTime).format("HH:mm")}
          onChange={evt => {
            setEndTime(moment(evt.target.value, ['hh:mm a', 'HH:mm']).toDate())
          }}
          name="endTime"
          type="time"
          label="End Time"
          InputLabelProps={{
            shrink: true,
          }}
          variant={variant}
        />
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} className={classes.calendarHolder} ref={parentElement} />
        <Grid item xs={12} className={classes.rangeSelectContainer} >
          <ButtonGroup disableElevation variant="text" size="small" >
            {Object.entries(RANGE_CONST).map(([key, value]) =>
              <Button className={classes.rangeButton} key={key} size="small" onClick={() => setRange(value)}>{value}</Button>
            )}
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} className={classes.bottomBar}>
          <Button variant="text" color="inherit"
            onClick={() => onCancel()
            }>Close</Button>
          <div className={classes.spacer} />
          <Button variant="text" color="primary"
            onClick={() => sendParsedDates()
            }>Apply</Button>
          <Button variant="text" color="secondary"
            onClick={() => clearDates()
            }>Clear</Button>


        </Grid>
      </Grid>
    </Grid>
  )
}

const WrapPicker = props => {
	//NOTE: Use this pattern to set the filters beforehand to prevent unecessary rerendering
	// const [state, dispatch] = useReducer(dataGridReducer, { ...initState, filterColumn: { partner: '', statuses: '' } });
	return (
		<LocalizationProvider dateAdapter={MomentUtils}>
			<LitePicker {...props} />
		</LocalizationProvider>
	);
};

export { WrapPicker as LitePicker };

