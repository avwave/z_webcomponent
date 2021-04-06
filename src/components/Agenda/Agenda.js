import React from "react";
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { AgendaContext } from "./AgendaContext";

import "./AgendaStyles.scss";
import GridBox from "../DataGrid/GridBox";
import { Box, Paper, Toolbar, Typography } from "@material-ui/core";
import AgendaToolbar from "./AgendaToolbar";

const localizer = momentLocalizer(moment);

const AgendaEventComponent = ({ event }) => {
  return (
    <GridBox align="flex-start">
      <Typography color={event.color}>{event.title}</Typography>
    </GridBox>
  );
};
const EventComponent = ({ event }) => {
  return (
    <GridBox align="flex-start">
        <Typography color={event.color} variant="caption">
          {event.title}
        </Typography>
    </GridBox>
  );
};
const eventPropGetter = ({ evtStyle }) => {
  return { style: evtStyle ?? {} };
};

function Agenda(props) {
  const [state, dispatch] = React.useContext(AgendaContext);
  return (
    <Paper style={{ height: 700, ...props.containerStyle }}>
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
          toolbar: AgendaToolbar
        }}
        eventPropGetter={eventPropGetter}
      />
    </Paper>
  );
}

export default Agenda;
