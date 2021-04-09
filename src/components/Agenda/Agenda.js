import React from "react";
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { AgendaContext } from "./AgendaContext";

import "./AgendaStyles.scss";
import GridBox from "../DataGrid/GridBox";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AgendaToolbar from "./AgendaToolbar";
import { ProgressContainer } from "../ProgressContainer";
import { EdgeContainer } from "../EdgeContainer";

const localizer = momentLocalizer(moment);

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
    eventComponent
    }= props;

  const metaRenderer = metaR ? metaR : () => {};

  const [state, dispatch] = React.useContext(AgendaContext);
  const [openAlert, setOpenAlert] = React.useState(false);
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
    return(
      <GridBox align="flex-start" variant={event.variant}>
        {eventComponent ? eventComponent(event) : (
          <Typography color={event.color} variant="caption">
            {event.title}
          </Typography>
        )}
      </GridBox>
    );
  };

  const AgendaDateHeader = ({ date, label, onDrillDown }) => {
    const summaryStatus = state.summaries?.find((summ) => {
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
    const { value, children } = slotProp;
    if (lockSlotEndTime || lockSlotStartTime) {
      if (isBetween(value, lockSlotStartTime, lockSlotEndTime)) {
        return children;
      }
      const child = React.Children.only(children);
      return React.cloneElement(child, {
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
    <Paper style={{ height: 700, ...containerStyle }}>
      <Dialog open={openAlert} onClose={handleCloseAlert}>
        <DialogContent>
          <DialogContentText>{alertMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Calendar
        {...props}
        localizer={localizer}
        events={state.events||defaultEvents}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: EventComponent,
          agenda: {
            event: AgendaEventComponent,
          },
          toolbar: AgendaToolbar,
          month: {
            dateHeader: AgendaDateHeader,
          },
          timeSlotWrapper: TimeslotWrapper,
        }}
        eventPropGetter={eventPropGetter}
        onSelectSlot={onSelectSlot}
        min={moment(lockSlotStartTime, "HH:mm").toDate()}
        max={moment(lockSlotEndTime, "HH:mm").toDate()}
        showMultiDayTimes
      />
    </Paper>
  );
}

export default Agenda;
