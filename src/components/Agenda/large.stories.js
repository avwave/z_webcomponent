import React from "react";
import { withReactContext } from "storybook-react-context";
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
import { Chip, Link, Typography } from "@material-ui/core";
import { personNameFormal } from "../utils/format";

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
    storyshots: { disable: true },
  },
  decorators: [
    withReactContext(),
    (Story) => (
      <AgendaProvider>
        <Story />
      </AgendaProvider>
    ),
  ],
};

export default AgendaStory;

const DefaultStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(AgendaContext);
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

  const DayViewCell = ({ event, ...rest }) => {
    const { booking } = event
    const start = moment(booking?.date_scheduled)

    const parse = parseBookingStatus(booking)
    return (
      <Chip
        size="small"
        style={{
          background: parse?.variant === 'outlined' ? 'inherit' : parse?.bgColor,
          color: parse?.variant === 'outlined' ? parse?.textColor : 'inherit',
        }}
        variant={parse?.variant}
        label={parse?.value}
      />
    )
  }


  return <Agenda
    containerStyle={{
      height: 750,
    }}
    timeslots={1}
    step={60}
    lockSlotStartTime="00:00"
    lockSlotEndTime="23:59"
    popup
    pickerToolbar
    views={[views.MONTH, views.WEEK, views.WORK_WEEK, views.DAY, views.AGENDA]}
    defaultView={views.AGENDA}
    style={{ flex: "1 1 auto" }}

    metaRenderer={(event) => {
      return (
        <div style={{color:'#000'}}>
          <Link>{event?.booking?.id}</Link>
          <Typography>{event?.booking?.type?.label}</Typography>
          <Typography><Link>{personNameFormal(event?.booking?.white_label_customer)}</Link></Typography>
          <DayViewCell event={event} />
        </div>
      )
    }}
  />;
};

export const Default = DefaultStory.bind({});
Default.args = {

};