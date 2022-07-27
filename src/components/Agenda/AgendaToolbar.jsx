import { Button, ButtonGroup, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LocalizationProvider, MobileDatePicker } from "@material-ui/pickers";
import MomentUtils from '@material-ui/pickers/adapter/moment';
import React, { useMemo } from "react";
import { Navigate } from "react-big-calendar";
import { views as calendarViews } from "react-big-calendar/lib/utils/constants";
import { WeekPicker } from "../WeekPicker";


const useStyles = makeStyles((theme) => ({
  leftGroup: {},
  rightGroup: {},
  title: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer"
  },
  root: {
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
  return (
    <Toolbar className={classes.root}>
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

      {renderTitle}

      <ButtonGroup variant="text" size="small" className={classes.rightGroup}>
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
