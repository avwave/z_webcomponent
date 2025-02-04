import { Chip, TextField } from "@mui/material";
import React from "react";

import { Agenda } from ".";
import { Button } from "../Button";
import isEmpty from "lodash.isempty";

import {
  baseEvents,
  daySummary,
  heightBugEvents,
  progressEvents,
  resourceEvents,
  resourceList
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
  parameters: {
    chromatic: { disable: true },
    // storyshots: { disable: true },
  },
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
  timeslots: 1,
  step: 60,
  lockSlotStartTime: "00:00",
  lockSlotEndTime: "23:59",
  popup: true,
  pickerToolbar: false,
  views: [views.MONTH, views.WEEK, views.WORK_WEEK, views.DAY, views.AGENDA],
  defaultView: views.WEEK,
  style: { flex: "1 1 auto" },
  events: [...baseEvents],
  onSelectEvent: (evt, element) => {
    console.log('index.stories.js (79) # evt, element', evt, element);
  },
  onRangeChange: (navtype, date, v) => {
    console.log('index.stories.js (82) # navtype, date', navtype, date, v);
  },
  useUrlAsState: true,
};


export const StandardCalendarWeek = DefaultStory.bind({});
StandardCalendarWeek.args = {
  ...Default.args,
  calendarWeek: true
};


export const PickerToolbar = DefaultStory.bind({});
PickerToolbar.args = {
  ...Default.args,
  pickerToolbar: true,
  calendarWeek: true
};

export const ToolbarFilterComponent = DefaultStory.bind({});
ToolbarFilterComponent.args = {
  ...Default.args,
  pickerToolbar: true,
  filterComponent: <TextField variant="standard" fullWidth onChange={(evt) => alert(evt)} />,
  calendarWeek: true
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
  views: [views.AGENDA],
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

export const CustomCellRendering = DefaultStory.bind({});
CustomCellRendering.args = {
  ...BlockView.args,
  eventComponent: ((event) => {
    return <pre>{JSON.stringify(event, null, 2)}</pre>
  }),
  components: {
    month: {
      event: (evt) => <pre>{JSON.stringify(evt, null, 2)}</pre>
    }
  },
  pickerToolbar: true,
}

const ResourceStory = ({ ...args }) => {
  const [state, dispatch] = React.useContext(AgendaContext);
  React.useEffect(() => {
    dispatch({
      payload: { events: args.events, summaries: args.summaries },
      type: actions.LOAD_DATA,
    });
  }, [args.events, args.summaries, dispatch]);

  return <Agenda {...args} />;
};

export const Resource = ResourceStory.bind({});
Resource.args = {
  containerStyle: {
    height: 750,
  },
  timeslots: 1,
  step: 60,
  lockSlotStartTime: "06:00",
  lockSlotEndTime: "23:59",
  popup: true,
  views: [views.DAY, views.AGENDA],
  defaultView: views.DAY,
  style: { flex: "1 1 auto" },
  events: resourceEvents[0].slots,
  resources: resourceList,
  resourceAccessor: 'resourceId',
  resourceIdAccessor: 'id',
  resourceTitleAccessor: 'title',
};
