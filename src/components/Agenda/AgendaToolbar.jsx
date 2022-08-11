import { Button, ButtonGroup, Grid, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, LocalizationProvider, MobileDatePicker } from "@material-ui/pickers";
import MomentUtils from '@material-ui/pickers/adapter/moment';
import clsx from "clsx";
import moment from "moment";
import React, { useMemo } from "react";
import { Navigate } from "react-big-calendar";
import { views as calendarViews } from "react-big-calendar/lib/utils/constants";
import { WeekPicker } from "../WeekPicker";


const useStyles = makeStyles((theme) => ({
  leftGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    alignContent: "center",
    flexDirection: "row",
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
    },
    alignContent: "center",
    flexDirection: "row",
  },
  title: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer"
  },
  root: {
  },
  padded: {
    marginRight: theme.spacing(2)
  },
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
  },
  item2: {
    order: 3,
    [theme.breakpoints.up("sm")]: {
      order: 2
    }
  },
  item3: {
    order: 2,
    [theme.breakpoints.up("sm")]: {
      order: 3
    }
  }
}));

const AgendaToolbar = ({
  date,
  view,
  views,
  label,
  localizer,
  onNavigate,
  onView,
  resources,
  picker = false,
  filterComponent,
  ...props
}) => {
  const classes = useStyles();

  const renderTitle = useMemo(
    () => {
      if (!picker) {
        return (<Typography variant="h6" className={classes.title}>
          {label}
        </Typography>)
      }
      if (view === calendarViews.WEEK || view === calendarViews.WORK_WEEK) {
        return (
          <div className={classes.title}>
            <WeekPicker
              value={date}
              onChange={range => {
                onNavigate(Navigate.DATE, range?.date?.toDate())
              }} />
          </div>
        )
      }
      else if (view === calendarViews.DAY) {
        return (
          <div className={classes.title}>
            <MobileDatePicker
              disableCloseOnSelect={false}
              disableMaskedInput
              showDaysOutsideCurrentMonth
              showToolbar={false}
              value={date}
              onChange={range => {
                onNavigate(Navigate.DATE, range?.toDate())
              }}
              renderInput={({ inputRef, inputProps, InputProps, ...props }) => {
                const date = moment(inputProps?.value)
                let dateweek = `${date.format('dddd ll')}`
                return (
                  <div className={classes.inputRoot}>
                    <input {...inputProps} readOnly hidden />
                    <Button {...inputProps} ref={inputRef} >{dateweek}</Button>
                    {InputProps?.endAdornment}
                  </div>
                )
              }}
            />
          </div>
        )
      }
      else if (view === calendarViews.MONTH) {
        return (
          <div className={classes.title}>
            <WeekPicker
              asMonthPicker
              value={date}
              onChange={range => {
                onNavigate(Navigate.DATE, range?.date?.toDate())
              }} />
          </div>
        )
      } else {
        return (<Typography variant="h6" className={classes.title}>
          {label}
        </Typography>)
      }
    }, [classes.title, label, onNavigate, picker]
  );
  const defColWidth = filterComponent ? 3 : 4
  return (
    <Toolbar className={classes.root}>
      <Grid container spacing={16} justify="flex-start" className={classes.container}>
        <Grid item xs={12} sm={6} md={defColWidth}>
          {!resources ?
            <ButtonGroup variant="text" size="small" className={classes.leftGroup}>
              <Button
                type="button"
                onClick={() => onNavigate(Navigate.TODAY, date)}
              >
                {localizer.messages.today}
              </Button>
              <Button
                type="button"
                onClick={() => onNavigate(Navigate.PREVIOUS, date)}
              >
                {localizer.messages.previous}
              </Button>
              <Button type="button" onClick={() => onNavigate(Navigate.NEXT, date)}>
                {localizer.messages.next}
              </Button>
            </ButtonGroup>
            : <Typography variant="overline" className={classes.leftGroup}>{" "}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6} md={defColWidth} className={classes.item2}>
          {renderTitle}
        </Grid>
        <Grid item xs={12} sm={6} md={defColWidth} className={classes.item3}>
          <div className={classes.rightGroup}>
            <ButtonGroup variant="text" size="small" className={clsx(filterComponent ? classes.padded : null, classes.rightGroup)}>
              {views?.map((viewItem, idx) => (
                <Button
                  type="button"
                  key={`view-${idx}`}
                  color={view === viewItem ? "primary" : "inherit"}
                  onClick={() => onView(viewItem)}
                >
                  {localizer.messages[viewItem]}
                </Button>
              ))}
            </ButtonGroup>

          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={defColWidth} className={classes.item3}>
          {filterComponent}
        </Grid>
      </Grid>
    </Toolbar>

  );
}

const WrapPicker = props => {
  //NOTE: Use this pattern to set the filters beforehand to prevent unecessary rerendering
  // const [state, dispatch] = useReducer(dataGridReducer, { ...initState, filterColumn: { partner: '', statuses: '' } });
  return (
    <LocalizationProvider dateAdapter={MomentUtils}>
      <AgendaToolbar {...props} />
    </LocalizationProvider>
  );
};

export { WrapPicker as AgendaToolbar };
