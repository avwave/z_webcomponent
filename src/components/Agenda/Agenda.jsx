import React, { Children, cloneElement, useContext, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import { AgendaContext } from "./AgendaContext";

import "./AgendaStyles.scss";
import GridBox from "../DataGrid/GridBox";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AgendaToolbar from "./AgendaToolbar";
import { ProgressContainer } from "../ProgressContainer";
import { EdgeContainer } from "../EdgeContainer";

import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enLocale from "date-fns/locale/en-US";
import sub from "date-fns/sub";

import BlockUi from "react-loader-advanced";

const dateFnsLocales = {
  "en-US": enLocale,
};
const useStyles = makeStyles(theme => ({
  root: {
    '& .rbc-event': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.dark,
    }
  }
}));

// const localizer = momentLocalizer(moment);
const sOfWeek = () =>
  startOfWeek(new Date(), {
    weekStartsOn: getDay(sub(new Date(), { days: 1 })),
  });
const localizer = dateFnsLocalizer({
  format,
  startOfWeek: sOfWeek,
  getDay,
  locales: dateFnsLocales,
});

export function isBetween(value, start, end) {
  const getTime = (dateTime) => {
    return moment({ h: dateTime.hours(), m: dateTime.minutes() });
  };

  const preTime = getTime(moment(start, "HH:mm"));
  const postTime = getTime(moment(end, "HH:mm"));
  const valTime = getTime(moment(value));

  return valTime.isBetween(preTime, postTime, "minutes", "[]");
}

function Agenda(props) {
  const {
    metaRenderer: metaR,
    alertMessage: alertM,
    lockSlotEndTime,
    lockSlotStartTime,
    onSelectSlot,
    containerStyle,
    defaultEvents,
    eventComponent,
  } = props;

  const classes = useStyles()
  const metaRenderer = metaR ? metaR : () => {};

  const [state, dispatch] = useContext(AgendaContext);
  const [openAlert, setOpenAlert] = useState(false);
  const alertMessage = alertM ?? "Outside allowed timerange";

  const AgendaEventComponent = ({ event }) => {
    return (
      <EdgeContainer clear variant={event.variant}>
        <GridBox align="flex-start">
          <Typography>{event.title}</Typography>
          <Typography variant="body2">{event.description}</Typography>
        </GridBox>
        <GridBox align="flex-start">{metaRenderer(event)}</GridBox>
      </EdgeContainer>
    );
  };
  const EventComponent = ({ event }) => {
    return (
      <GridBox align="flex-start" variant={event.variant}>
        {eventComponent ? (
          eventComponent(event)
        ) : (
          <Typography color={event.color} variant="caption">
            {event.title}
          </Typography>
        )}
      </GridBox>
    );
  };

  const AgendaDateHeader = ({ date, label, onDrillDown }) => {
    const summaryStatus = state?.summaries?.find((summ) => {
      const comp = moment(date).isSame(summ.date);
      return comp;
    });
    return (
      <Box width="100%" fontWeight="fontWeightBold">
        <Link color="textPrimary" onClick={onDrillDown}>
          <Typography variant="caption">
            {summaryStatus?.summary?.status}{" "}
          </Typography>
          {label}
        </Link>
      </Box>
    );
  };

  const TimeslotWrapper = (slotProp) => {
    const {resource, value, children } = slotProp;
    if (resource) {
      return children;
    }
    if (moment(value).isBefore(moment(), "day")) {
      const child = Children.only(children);
      return cloneElement(child, {
        className: child.props.className + " rbc-off-range-bg",
      });
    }
    if (lockSlotEndTime || lockSlotStartTime) {
      if (isBetween(value, lockSlotStartTime, lockSlotEndTime)) {
        return children;
      }
      const child = Children.only(children);
      return cloneElement(child, {
        className: child.props.className + " rbc-off-range-bg",
      });
    }
    return children;
  };

  const eventPropGetter = ({ evtStyle }) => {
    return { style: evtStyle ?? {} };
  };

  const onSelectSlotHandler = (slotProps) => {
    const { start, end } = slotProps;
    if (
      isBetween(start, lockSlotStartTime, lockSlotEndTime) &&
      isBetween(end, lockSlotStartTime, lockSlotEndTime)
    ) {
      onSelectSlot(slotProps);
    } else {
      setOpenAlert(true);
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <BlockUi 
    message={<CircularProgress/>}
    backgroundStyle={{backgroundColor: '#ffffffcc'}}
    show={!!state?.loading} style={{ height: 700, ...containerStyle }}
    >
      <Paper elevation={0} square>
        <Dialog open={openAlert} onClose={handleCloseAlert}>
          <DialogContent>
            <DialogContentText>{alertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseAlert} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Calendar
          className={classes.root}
          localizer={localizer}
          events={state?.events || defaultEvents}
          startAccessor="start"
          endAccessor="end"
          components={{
            event: EventComponent,
            agenda: {
              event: AgendaEventComponent,
            },
            toolbar: (toolbarProps) => <AgendaToolbar {...toolbarProps} {...props} />,
            month: {
              dateHeader: AgendaDateHeader,
            },
            timeSlotWrapper: TimeslotWrapper,
            ...props.components
          }}
          eventPropGetter={eventPropGetter}
          onSelectSlot={onSelectSlot}
          min={moment(lockSlotStartTime, "HH:mm").toDate()}
          max={moment(lockSlotEndTime, "HH:mm").toDate()}
          showMultiDayTimes
          {...props}
        />
      </Paper>
    </BlockUi>
  );
}

export default Agenda;
