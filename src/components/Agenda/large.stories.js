import React, { useState } from "react";

import { Agenda } from ".";

import {
  baseEvents
} from "./events";

import AgendaProvider, {
  actions, AgendaContext
} from "./AgendaContext";

import { views } from "react-big-calendar/lib/utils/constants";
import { largeData } from "./largedataset";
import moment from "moment";
import { parseBookingStatus } from "./bookingStates";
import { Chip, Link, Typography } from "@mui/material";
import { personNameFormal } from "../utils/format";
import { AggregateWeekView } from "./AggregateWeekView";
import { AggregateCell, AggregateEventCell, DayViewCell, DayViewHeader, DayViewToolTip, WeekViewCell } from "./DayViewCell";
import { wideLoadAlgorithm } from "./WideLoadAlgorithm";

const AgendaStory = {
  component: Agenda,
  title: "Agenda/LargeSet",
  argTypes: {
    view: {
      control: {
        type: "select",
        options: ["month", "week", "day", "agenda"],
      },
    },
  },
  parameters: {
    chromatic: { disable: true },
    // storyshots: { disable: true },
  },
};

export default AgendaStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(AgendaContext);
  const [currentView, setCurrentView] = useState(views.WEEK);

  React.useEffect(() => {
    const events = largeData.map(event => {
      const parse = parseBookingStatus(event)
      return {
        booking: { ...event },
        id: event.id,
        start: moment(event?.date_scheduled).toDate(),
        end: moment(event?.date_scheduled_end).toDate(),
        variant: parse?.eventVariant,
        evtStyle: {
          backgroundColor: "transparent",
          color: parse?.textColor,
        },
      }
    })
    dispatch({
      payload: { events },
      type: actions.LOAD_DATA,
    });
  }, [args.events, args.summaries, dispatch]);

  return (
    <Agenda
      containerStyle={{
        height: 750,
      }}
      lockSlotStartTime="07:00"
      lockSlotEndTime="23:59"
      popup
      pickerToolbar
      calendarWeek
      tooltipAccessor={null}
      step={15}
      timeslots={4}
      components={{
        week: {
          event: (evt) => <AggregateEventCell event={evt} />
        },
        day: {
          event: (evt) => <WeekViewCell event={evt} />,
        },
        eventWrapper: ({ event, children, type, selected, ...REST }) => {
          if(currentView === views.WEEK) {
            return <AggregateCell event={event}>{children}</AggregateCell>
          }
          return <DayViewToolTip view={currentView} selected={selected} event={event}>{children}</DayViewToolTip>
        }
      }}
      views={{
        month: true,
        week: AggregateWeekView,
        day: true,
      }}
      defaultView={views.WEEK}
      style={{ flex: "1 1 auto" }}

      onViewChange={(view) => {
        setCurrentView(view)
      }}
      metaRenderer={(event) => {
        return (
          <div style={{ color: '#000' }}>
            <Link underline="hover">{event?.booking?.id}</Link>
            <Typography>{event?.booking?.type?.label}</Typography>
            <Typography><Link underline="hover">{personNameFormal(event?.booking?.white_label_customer)}</Link></Typography>
        
          </div>
        );
      }}
      dayLayoutAlgorithm={wideLoadAlgorithm}
    />
  );
};

export const Default = DefaultStory.bind({});
Default.args = {

};