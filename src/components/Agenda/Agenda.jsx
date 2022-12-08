import moment from "moment";
import React, { Children, cloneElement, useContext, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  momentLocalizer
} from "react-big-calendar";
import { AgendaContext } from "./AgendaContext";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import GridBox from "../DataGrid/GridBox";
import { EdgeContainer } from "../EdgeContainer";
import "./AgendaStyles.scss";
import { AgendaToolbar } from "./AgendaToolbar";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enLocale from "date-fns/locale/en-US";
import startOfWeek from "date-fns/startOfWeek";
import sub from "date-fns/sub";

import BlockUi from "react-loader-advanced";
import { useUrlState } from "../hooks/useUrlState";

const dateFnsLocales = {
  "en-US": enLocale,
};
const useStyles = makeStyles()(theme => ({
  root: {
    '& .rbc-event': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.dark,
    }
  }
}));

// const localizer = momentLocalizer(moment);

export function isBetween(value, start, end) {
  const getTime = (dateTime) => {
    return moment({ h: dateTime.hours(), m: dateTime.minutes() });
  };

  const preTime = getTime(moment(start, "HH:mm"));
  const postTime = getTime(moment(end, "HH:mm"));
  const valTime = getTime(moment(value));

  return valTime.isBetween(preTime, postTime, "minutes", "[]");
}

function Agenda(_props) {
  const {
    metaRenderer: metaR,
    alertMessage: alertM,
    lockSlotEndTime,
    lockSlotStartTime,
    onSelectSlot,
    containerStyle,
    defaultEvents,
    eventComponent,
    pickerToolbar,
    filterComponent,
    calendarWeek = false,
    components: extraComponents,
    onViewChange=()=>{},
    id="calendar",
    useUrlAsState=false,
    ...props
  } = _props;

  const { classes } = useStyles()
  const metaRenderer = metaR ? metaR : () => { };

  const [currentDate, setCurrentDate] = useUrlState({
    queryKey:`${id}-date`,
    disable: !useUrlAsState,
  });

  const [paramView, setParamView] = useUrlState({
    queryKey:`${id}-view`,
    disable: !useUrlAsState,
    defaultValue: props?.defaultView
  })

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
        <Link color="textPrimary" onClick={onDrillDown} underline="hover">
          <Typography variant="caption">
            {summaryStatus?.summary?.status}{" "}
          </Typography>
          {label}
        </Link>
      </Box>
    );
  };

  const TimeslotWrapper = (slotProp) => {
    const { resource, value, children } = slotProp;
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

  const sOfWeek = () =>
    startOfWeek(new Date(), {
      weekStartsOn: calendarWeek ? 0 : getDay(sub(new Date(), { days: 1 })),
    });

  // const localizer = dateFnsLocalizer({
  //   format,
  //   startOfWeek: sOfWeek,
  //   getDay,
  //   locales: dateFnsLocales,
  // });

  moment.locale('en-US', {
    week: {
      dow: calendarWeek ? 0 : getDay(sub(new Date(), { days: 1 })),
    }
  })
  const localizer = momentLocalizer(moment)

  return (
    <BlockUi
      message={<CircularProgress />}
      backgroundStyle={{ backgroundColor: '#ffffffcc' }}
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
            toolbar: (toolbarProps) => <AgendaToolbar
              filterComponent={filterComponent}
              picker={!!pickerToolbar} {...toolbarProps} {...props}
            />,
            month: {
              dateHeader: AgendaDateHeader,
            },
            timeSlotWrapper: TimeslotWrapper,
            ...extraComponents
          }}
          eventPropGetter={eventPropGetter}
          onSelectSlot={onSelectSlot}
          min={moment(lockSlotStartTime, "HH:mm").toDate()}
          max={moment(lockSlotEndTime, "HH:mm").toDate()}
          showMultiDayTimes
          length={7} //week by default
          onView={(view)=>{
            onViewChange(view)
            setParamView(view)
          }}
          view={paramView}
          date={currentDate}
          onNavigate={(date, view)=>{
            setCurrentDate(date)
          }}
          {...props}
        />
      </Paper>
    </BlockUi>
  );
}

export default Agenda;
