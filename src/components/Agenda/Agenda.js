import React from "react";
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { AgendaContext } from "./AgendaContext";

import "./AgendaStyles.scss";
import GridBox from "../DataGrid/GridBox";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Link, Paper, Toolbar, Typography } from "@material-ui/core";
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
  const metaRenderer = props.metaRenderer ? props.metaRenderer : () => {};

  const [state, dispatch] = React.useContext(AgendaContext);
  const [openAlert, setOpenAlert] = React.useState(false);
  const alertMessage = props.alertMessage ?? "Outside allowed timerange"

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
    const BaseComponent = ({ variant }) => (
      <GridBox align="flex-start" variant={variant}>
        <Typography color={event.color} variant="caption">
          {event.title}
        </Typography>
      </GridBox>
    );
    return event.progress ? (
      <ProgressContainer progress={event.progress} variant={event.variant}>
        <BaseComponent />
      </ProgressContainer>
    ) : (
      <BaseComponent variant={event.variant ?? "primary"} />
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
    const { value, children } = slotProp
    if (props.lockSlotEndTime || props.lockSlotStartTime) {
      if (isBetween(value, props.lockSlotStartTime, props.lockSlotEndTime)) {
        return children;
      }
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        className: child.props.className + " rbc-off-range-bg",
      });
    }
    return children
  };

  const eventPropGetter = ({ evtStyle }) => {
    return { style: evtStyle ?? {} };
  };


  const onSelectSlot = (slotProps) => {
    const {start, end} = slotProps
    if(isBetween(start, props.lockSlotStartTime, props.lockSlotEndTime) &&
    isBetween(end, props.lockSlotStartTime, props.lockSlotEndTime)) {
      props.onSelectSlot(slotProps)
    } else {
      setOpenAlert(true)
    }
  }
  const handleCloseAlert = () => {setOpenAlert(false)}

    const min = new Date();
    min.setHours(8);
    min.setMinutes(0, 0, 0);

    const max = new Date();
    max.setHours(23);
    max.setMinutes(0, 0, 0);

    console.log("🚀 ~ file: Agenda.js ~ line 119 ~ Agenda ~ min, moment(props.lockSlotStartTime).toDate()", min, moment(props.lockSlotStartTime).toDate())

  return (
    <Paper style={{ height: 700, ...props.containerStyle }}>
      <Dialog open={openAlert}
      onClose={handleCloseAlert}
      >
        <DialogContent>
          <DialogContentText>{alertMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" >
            Ok
          </Button>
          </DialogActions>
      </Dialog>
      <Calendar
        {...props}
        localizer={localizer}
        events={state.events}
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
        min={moment(props.lockSlotStartTime, "HH:mm").toDate()}
        max={moment(props.lockSlotEndTime, "HH:mm").toDate()}
        
        showMultiDayTimes
      />
    </Paper>
  );
}

export default Agenda;
