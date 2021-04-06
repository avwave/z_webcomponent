import React from "react";
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { AgendaContext } from "./AgendaContext";

import "./AgendaStyles.scss";
import GridBox from "../DataGrid/GridBox";
import { Box, Link, Paper, Toolbar, Typography } from "@material-ui/core";
import AgendaToolbar from "./AgendaToolbar";

const localizer = momentLocalizer(moment);

function Agenda(props) {
  const [state, dispatch] = React.useContext(AgendaContext);

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

  const AgendaDateHeader = ({ date, label, onDrillDown }) => {
    const summaryStatus = state.summaries?.find(summ=> {
      const comp = moment(date).isSame(summ.date)
      return comp
    })
    return (
      <Box width="100%" fontWeight="fontWeightBold">
        <Link color="textPrimary" onClick={onDrillDown}>
          <Typography variant="caption">{summaryStatus?.summary?.status} </Typography>
          {label}
        </Link>
      </Box>
    );
  };
  const eventPropGetter = ({ evtStyle }) => {
    return { style: evtStyle ?? {} };
  };

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
          toolbar: AgendaToolbar,
          month: {
            dateHeader: AgendaDateHeader,
          },
        }}
        eventPropGetter={eventPropGetter}
      />
    </Paper>
  );
}

export default Agenda;
