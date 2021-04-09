import { Chip } from "@material-ui/core";
import React from "react";
import { withReactContext } from "storybook-react-context";
import { Agenda } from ".";
import { Button } from "../Button";
import isEmpty from "lodash.isempty";

import {
  baseEvents,
  daySummary,
  heightBugEvents,
  progressEvents,
} from "./events";

import AgendaProvider, {
  AgendaReducer,
  AgendaContext,
  actions,
  initState,
} from "./AgendaContext";

import moment from "moment";
import { views } from "react-big-calendar/lib/utils/constants";

const AgendaStory = {
  component: Agenda,
  title: "Agenda/Agenda",
  argTypes: {
    view: {
      control: {
        type: "select",
        options: ["month", "week", "day", "agenda"],
      },
    },
  },
  decorators: [
    withReactContext({
      reducer: AgendaReducer,
      context: AgendaContext,
      initialState: { ...initState },
    }),
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
    dispatch({
      payload: { events: args.events, summaries: args.summaries },
      type: actions.LOAD_DATA,
    });
  }, [args.events, args.summaries, dispatch]);

  return <Agenda {...args} />;
};

export const Default = DefaultStory.bind({});
Default.args = {
  containerStyle: {
    height: 750,
  },
  timeslots: 8,
  step: 30,
  lockSlotStartTime: "00:00",
  lockSlotEndTime: "23:59",
  popup: true,
  views: [views.WEEK, views.WORK_WEEK, views.AGENDA],
  defaultView: views.WEEK,
  style: { flex: "1 1 auto" },
  events: [...baseEvents],
};

export const CustomDayHeader = DefaultStory.bind({});
CustomDayHeader.args = {
  ...Default.args,
  summaries: [...daySummary],
};

export const VariableHeightEventsBug = DefaultStory.bind({});
VariableHeightEventsBug.args = {
  ...Default.args,
  events: [...heightBugEvents],
};

export const ProgressEvent = DefaultStory.bind({});
ProgressEvent.args = {
  ...Default.args,
  events: [...progressEvents],
  summaries: [],
};

export const AgendaMetaRendering = DefaultStory.bind({});
AgendaMetaRendering.args = {
  ...Default.args,
  views:[views.AGENDA],
  defaultView: "agenda",
  events: [...progressEvents],
  metaRenderer: (event) => {
    return (
      <div>
        event object:
        <pre>{JSON.stringify(event, null, 2)}</pre>;
      </div>
    )
  },
};


export const BlockView = DefaultStory.bind({})
BlockView.args = {
  ...Default.args,
  events: [...progressEvents],
  timeslots: 1,
  step: 240,
  lockSlotStartTime: "08:00",
  lockSlotEndTime: "23:59",
  defaultView: 'week',
  selectable: true,
  onSelectEvent: (event) => alert(event.title),
  onSelectSlot: (slot) => alert(`${slot.start} to ${slot.end}`),
  
};
